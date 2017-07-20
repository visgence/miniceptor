export default class sensorController { // ', ['frapontillo.bootstrap-switch',])

    constructor($scope, $http, $location) {
        'ngInject';

        this.$scope = $scope;
        this.$http = $http;
        this.$location = $location;

        // tabs:
        // config, entry, export, command, metatdata
        $scope.tab = 'config';
        $scope.isSelected = 'yep'; // For the bootstrap switch in command.
        $scope.isActive = 'false';
        $scope.ShowInfo = false;

        $scope.ChangeTab = (event, tab) => {
            $scope.tab = tab;
            $('.nav-tabs li').removeClass('active');
            $(event.target.parentNode).toggleClass('active');
        };

        $scope.EditFields = () => {
            $scope.editing = true;
            $scope.previous_coefficients = $scope.sensor.last_calibration.coefficients;
        };

        $scope.CancelFields = () => {
            $scope.editing = false;
        };

        $scope.SendData = () => {
            const sensorInfo = infoService.getSensorInfo();
            const id = sensorInfo.uuid;
            const newValue = angular.element('#manualEntry')[0].value;
            const time = (new Date()).getTime() / 1000;

            const sensorReading = {
                name: id,
                sensor_type: sensorInfo.sensor_type,
                timestamp: time,
                meta_data: {},
            };

            const payload = [{
                info: {
                    uuid: '',
                    name: sensorInfo.name,
                    description: sensorInfo.description,
                    out: (sensorInfo.isInput ? [] : [sensorReading]),
                    in: (sensorInfo.isInput ? [sensorReading] : []),
                },
                readings: [
                    [id, newValue, time],
                ],
            }];
            apiService.post('station', payload).then(
                (response) => {
                    console.log(response);
                },
                (response) => {
                    console.log('error');
                    console.log(response);
                });
        };

        $scope.SaveFields = () => {
            const updateData = {};
            const url = 'sensors';
            const editableFields = ['last_calibration', 'units', 'description', 'uuid'];

            $scope.sensor.forEach((i) => {
                if (!(editableFields.includes(i))) {
                    return;
                }
                if ($scope.sensor[i] === '-' || $scope.sensor[i] === '') {
                    updateData[i] = null;
                } else {
                    updateData[i] = $scope.sensor[i];
                }
            });
            if (updateData.last_calibration.coefficients !== $scope.previous_coefficients) {
                updateData.last_calibration.timestamp = Date.now() / 1000;
            }

            apiService.put(url, updateData).then(
                (success) => {
                    $scope.editing = false;
                    location.reload();
                },
                (error) => {
                    console.log('Error Occured: ', error.data);

                });
        };

        $scope.CommandSwitch = () => {
            sendCommand();
        };

        $scope.ExportEs = () => {
            const start = timeService.getValues().start;
            const end = timeService.getValues().end;
            const readingsUrl = 'readings?datastream=' +
                infoService.getStreamInfo().id +
                '&start=' + parseInt(start / 1000) +
                '&end=' + parseInt(end / 1000) +
                '&source=ElasticSearch';
            apiService.get(readingsUrl).then(
                (success) => {
                    exportData(success);
                },
                (error) => {
                    console.log('error');
                    console.log(error);
                });
        };

        $scope.ExportSQL = () => {
            exportData(null);
        };

        $(() => {
            $('#exportEsBtn').on('click', () => {
                const start = timeService.getValues().start;
                const end = timeService.getValues().end;
                const readingsUrl = 'readings?datastream=' +
                    infoService.getStreamInfo().id +
                    '&start=' + parseInt(start / 1000) +
                    '&end=' + parseInt(end / 1000) +
                    '&source=ElasticSearch';
                apiService.get(readingsUrl).then(
                    (success) => {
                        exportData(success);
                    },
                    (error) => {
                        console.log('error');
                        console.log(error);
                    });
            });
            $('#exportSqlBtn').on('click', () => {
                exportData(null);
            });
            $('#send_data').on('click', () => {
                const sensorInfo = infoService.getSensorInfo();
                const id = sensorInfo.uuid;
                const newValue = angular.element('#manEntry')[0].value;
                const time = (new Date()).getTime() / 1000;

                const sensorReading = {
                    name: id,
                    sensor_type: sensorInfo.sensor_type,
                    timestamp: time,
                    meta_data: {},
                };

                const payload = [{
                    info: {
                        uuid: '',
                        name: sensorInfo.name,
                        description: sensorInfo.description,
                        out: (sensorInfo.isInput ? [] : [sensorReading]),
                        in: (sensorInfo.isInput ? [sensorReading] : []),
                    },
                    readings: [
                        [id, newValue, time],
                    ],
                }];

                $http.post('station', payload).then(
                    (success) => {
                        console.log(response);
                    },
                    (error) => {
                        console.log('error');
                        console.log(error);
                    });
            });
            $('#sendCommand').on('click', () => {
                sendCommand();
            });
        }, 1000);

        this.LoadSensor();

    }

    LoadSensor() {
        const stream = this.$location.search().ds;
        this.$http.get('api/sensors?datastream=' + stream).then(
            (success) => {

                success.data.forEach((i) => {
                    if (i === null) {
                        i = '-';
                    }
                });
                this.$scope.sensor = success.data;
                this.$scope.ShowInfo = true;

                if (success.data.sensor_type === 'output') {
                    this.$scope.isActive = true;
                    // We need to set the preliminary state
                }
            },
            (error) => {
                console.log('error');
                console.log(error);
            },
        );
    }

    exportData(readings) {
        const sensorInfo = infoService.getSensorInfo();
        if (readings === null) {
            readings = infoService.getReadingsInfo().readings;
        }

        const scaledReadings = [];
        let i;
        for (i = 0; i < readings.length; i++) {
            scaledReadings.push(readings[i][1] * sensorInfo.last_calibration.coefficients[0] + sensorInfo.last_calibration.coefficients[1]);
        }

        // actual delimiter characters for CSV format
        const colDelim = ',';
        const rowDelim = '\r\n';

        // build csv string
        let csv = '';
        csv += 'timestamp' + colDelim + 'UUID' + colDelim + 'value' + colDelim + 'scaled value' + colDelim + 'units' + rowDelim;
        for (i = 0; i < readings.length; i++) {
            csv += readings[i][0] +
                colDelim + sensorInfo.uuid +
                colDelim + readings[i][1] +
                colDelim + scaledReadings[i] +
                colDelim + sensorInfo.units +
                rowDelim;
        }
        // Data URI
        const today = new Date();

        const downloadFilename = sensorInfo.uuid + '_' +
            today.getMonth() +
            1 + '-' +
            today.getDate() + '-' +
            today.getFullYear() + '_' +
            today.getHours() + ':' +
            today.getMinutes() + '.csv';

        // actually download
        const link = document.createElement('a');
        link.download = downloadFilename;
        link.href = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
        link.click();
    }

    sendCommand() {
        const sensorInfo = infoService.getSensorInfo();
        // p ost new value to commands api
        const payload = {
            message: angular.element('#bsSwitch')[0].value,
            duration: 60000,
            sensor_id: sensorInfo.uuid,
        };
        apiService.post('messages/', payload).then(
            (success) => {
                console.log('the response was:');
                console.log(success);
            },
            (error) => {
                console.log('error');
                console.log(error);
            });
    }


}
