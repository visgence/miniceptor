import 'eonasdan-bootstrap-datetimepicker';
// Hack until tempusdominus comes out of alpha, see readme for link.
import './../css/bootstrap-datetimepicker.min.css';

export default class timeController {
    constructor($scope, $location) {
        'ngInject';
        this.$scope = $scope;
        this.$location = $location;

        console.log('hello time');

        $(() => {
            $('#start-time-picker').datetimepicker();
            $('#end-time-picker').datetimepicker();
        });

        $scope.SubmitDates = () => {
            const startTime = $('#start-time-picker').data('DateTimePicker').date();
            const endTime = $('#end-time-picker').data('DateTimePicker').date();

            console.log(startTime.unix(), endTime.unix());
        };
    }
}
