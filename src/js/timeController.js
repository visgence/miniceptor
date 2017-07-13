import 'eonasdan-bootstrap-datetimepicker';
// Hack until tempusdominus comes out of alpha, see readme for link.
import './../css/bootstrap-datetimepicker.min.css';

export default class timeController {
    constructor($scope, $location) {
        'ngInject';
        this.$scope = $scope;
        this.$location = $location;

        console.log('hello time');

        $(function () {
            $('#startTimePicker').datetimepicker();
            $('#endTimePicker').datetimepicker();
        });

        $scope.SubmitDates = () => {
            const startTime = $('#startTimePicker').data('DateTimePicker').date();
            const endTime = $('#endTimePicker').data('DateTimePicker').date();

            console.log(startTime.unix(), endTime.unix());
        };
    }
}
