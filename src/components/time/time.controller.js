export default class timeController {

    constructor($scope, $location) {
        'ngInject';

        this.$scope = $scope;
        this.$location = $location;
    }

    $onInit() {

        if (this.$location.search().start !== undefined) {
            this.$scope.startDate = new Date(this.$location.search().start * 1000);
        }
        if (this.$location.search().end !== undefined) {
            this.$scope.endDate = new Date(this.$location.search().end * 1000);
        }

        this.$scope.SubmitDates = () => {
            let startTime = this.$scope.startDate;
            let endTime = this.$scope.endDate;

            if (startTime !== undefined) {
                startTime = new Date(startTime);
                this.$location.search('start', startTime.getTime() / 1000);
            } else {
                this.$location.search('start', null);
            }

            if (endTime !== undefined) {
                endTime = new Date(endTime);
                this.$location.search('end', endTime.getTime() / 1000);
            } else {
                this.$location.search('end', null);
            }
        };
    }
}
