export default class streamController {

    constructor(apiService, $scope, $location) {
        'ngInject';
        this.$scope = $scope;
        this.$location = $location;
        this.apiService = apiService;
    }

    $onInit() {

        this.$scope.stream = {};
        this.$scope.editing = false;
        this.$scope.ShowInfo = false;

        this.$scope.EditFields = () => {
            $('#warning-message').css('display', 'none');
            this.$scope.editing = true;
        };

        this.$scope.CancelFields = () => {
            this.$scope.editing = false;
        };

        this.$scope.AddPath = () => {
            this.$scope.stream.paths.push({
                url: '/new_path_' + $scope.stream.paths.length,
            });
        };

        this.$scope.SaveFields = () => {
            const updateData = {};
            let hasErrors = false;
            this.$scope.stream.forEach((i) => {
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
            const url = 'datastream/' + updateData.id;
            this.apiService.post(url, updateData)
                .then((success) => {
                    this.$scope.editing = false;
                    location.reload();
                })
                .catch((error) => {
                    console.log('Error');
                    console.log(error);
                });
        };
        this.LoadStream();
    }

    LoadStream() {
        let stream = this.$location.search().ds;
        if (stream === undefined) {
            stream = '1';
        }
        this.apiService.get('datastream/' + stream)
            .then((success) => {
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
                this.$scope.stream = dataToDisplay;
                this.$scope.ShowInfo = true;
                return;
            })
            .catch((error) => {
                console.log('error');
                console.log(response);
            });
    }
}
