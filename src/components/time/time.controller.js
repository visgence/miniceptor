export default class timeController {

    constructor($scope, $location) {
        'ngInject';

        this.$scope = $scope;
        this.$location = $location;
    }

    $onInit() {

        this.$scope.startDate = new Date(this.$location.search().start);
        this.$scope.startDate = new Date(this.$location.search().end);

        this.$scope.SubmitDates = () => {
            let startTime = this.$scope.startDate;
            let endTime = this.$scope.endDate;
            if (startTime !== undefined) {
                startTime = new Date(startTime);
                this.$location.search('start', startTime.getTime() / 1000);
            } else {
                this.$location.search('start', null);
            }
            console.log(endTime)
            if (endTime !== undefined) {
                endTime = new Date(endTime)
                this.$location.search('end', endTime.getTime() / 1000);
            } else {
                this.$location.search('end', null);
            }
        };
    }
}
