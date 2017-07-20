export default class streamController {

    constructor($scope, $http, $location) {
        'ngInject';

        this.$scope = $scope;
        this.$http = $http;
        this.$location = $location;

        $scope.stream = {};
        $scope.editing = false;
        $scope.ShowInfo = false;

        $scope.EditFields = () => {
            $('#warning-message').css('display', 'none');
            $scope.editing = true;
        };

        $scope.CancelFields = () => {
            $scope.editing = false;
        };

        $scope.AddPath = () => {
            $scope.stream.paths.push({
                url: '/new_path_' + $scope.stream.paths.length,
            });
        };

        $scope.SaveFields = () => {
            const updateData = {};
            let hasErrors = false;
            $scope.stream.forEach((i) => {
                if (i === '-' || i === '') {
                    updateData[i] = null;
                } else if (i === 'paths') {
                    updateData.paths = [];
                    i.forEach((j) => {
                        if (j.url === '') {

                            return;
                        }
                        if (!j.url.startsWith('/')) {
                            $('#warning-message').css('display', 'block');
                            $('#warning-message').html('Paths must begin with a "/".');
                            hasErrors = true;
                            return;
                        }
                        if (j.url.includes(' ')) {
                            $('#warning-message').css('display', 'block');
                            $('#warning-message').html('Paths cannot have any spaces.');
                            hasErrors = true;
                            return;
                        }
                        updateData.paths[j] = j.url;
                    });
                } else {
                    updateData[i] = i;
                }
            });

            if (hasErrors) {
                return;
            }
            const url = 'datastreams/' + updateData.id;
            $http.put(url, updateData).then(
                (response) => {
                    $scope.editing = false;
                    location.reload();
                }, (response) => {
                    console.log('Error Occured: ', response.data);
                },
            );
        };
        this.LoadStream();
    }

    LoadStream() {
        let stream = this.$location.search().ds;
        if (stream === undefined) {
            stream = '1';
        }
        this.$http.get('/api/streams' + stream).then(
            (response) => {
                const dataToDisplay = {};
                // for (var i in v) {
                //     if (v[i] === null) {
                //         dataToDisplay[i] = "-";
                //     } else if (i === 'paths') {
                //         dataToDisplay.paths = [];
                //         for (var j in v[i]) {
                //             dataToDisplay.paths.push({
                //                 url: v[i][j],
                //             });
                //         }
                //     } else {
                //         dataToDisplay[i] = v[i];
                //     }
                // }
                $scope.stream = dataToDisplay;
                $scope.ShowInfo = true;
                return;
            },
            (response) => {
                console.log('error');
                console.log(response);
            },
        );
    }
}
