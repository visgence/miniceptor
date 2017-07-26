import 'eonasdan-bootstrap-datetimepicker';
// Hack until tempusdominus comes out of alpha, see readme for link.
import './../../css/bootstrap-datetimepicker.min.css';

export default class timeController {

    constructor($scope, $location) {
        'ngInject';

        this.$scope = $scope;
        this.$location = $location;
    }

    $onInit() {
        const startTime = parseInt(this.$location.search().start) || Date.now() / 1000 - 3600;
        const endTime = parseInt(this.$location.search().end) || Date.now() / 1000;
        $('#start-time-picker').datetimepicker({
            defaultDate: startTime * 1000,
        });
        $('#end-time-picker').datetimepicker({
            defaultDate: endTime * 1000,
        });


        this.$scope.SubmitDates = () => {
            const startTime = $('#start-time-picker').data('DateTimePicker').date();
            const endTime = $('#end-time-picker').data('DateTimePicker').date();
            if (startTime !== null) {
                this.$location.search('start', startTime.unix());
            } else {
                this.$location.search('start', null);
            }
            if (endTime !== null) {
                this.$location.search('end', endTime.unix());
            } else {
                this.$location.search('end', null);
            }
        };
    }
}
