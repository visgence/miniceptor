export default class graphController {
    constructor($scope) {
        'ngInject';
        this.$scope = $scope;
        $scope.versionNumber = window.version;
    }
}
