import 'eonasdan-bootstrap-datetimepicker';
// Hack until tempusdominus comes out of alpha, see readme for link.
import './../css/bootstrap-datetimepicker.min.css';

export default class timeController {
    constructor($scope, $location) {
        'ngInject';

        $(() => {
            const startTime = parseInt($location.search().start) || Date.now() / 1000 - 3600;
            const endTime = parseInt($location.search().end) || Date.now() / 1000;
            $('#start-time-picker').datetimepicker({
                defaultDate: startTime * 1000,
            });
            $('#end-time-picker').datetimepicker({
                defaultDate: endTime * 1000,
            });
        });

        $scope.SubmitDates = () => {
            const startTime = $('#start-time-picker').data('DateTimePicker').date();
            const endTime = $('#end-time-picker').data('DateTimePicker').date();
            if (startTime !== null) {
                $location.search('start', startTime.unix());
            } else {
                $location.search('start', null);
            }
            if (endTime !== null) {
                $location.search('end', endTime.unix());
            } else {
                $location.search('end', null);
            }
        };
    }
}
