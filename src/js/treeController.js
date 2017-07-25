require('./../../node_modules/bootstrap-treeview/dist/bootstrap-treeview.min.js');

export default class treeController {
    constructor($scope, $location, $http, $timeout) {
        'ngInject';

        this.$scope = $scope;
        this.$location = $location;
        this.$http = $http;
        this.$timeout = $timeout;

        $scope.treeLoaded = false;
        $scope.searchFilter = 'Stream';

        this.LoadData();

        $scope.searchInput = () => {
            const data = {
                word: $scope.searchWords,
                filter: $scope.searchFilter,
            }
            $http({
              url: '/api/datastream/?word=' + data.word + '&filter=' + data.filter,
              method: 'GET',
            }).then(
                (success) => {
                    console.log(success)
                    const treeStructure = this.MakeTreeStructure(success.data);
                    this.RenderTree(treeStructure);
                },
                (error) => {
                    console.log('error')
                    console.log(error);
                },
            );
        }
    }

    LoadData() {
        this.$http.get('/api/datastream').then(
            (success) => {
                const paths = success.data;
                const treeStructure = this.MakeTreeStructure(paths);
                this.RenderTree(treeStructure);
            },
            (error) => {
                console.log(error);
                $('#tree-message').toggleClass('alert-danger');
                $('#tree-message').html('Something went wrong gettin data from the server, check the console for details.');
            });
    }


    MakeTreeStructure(pathsArr) {
        let nodeArray = [];
        this.$scope.nodeCount = 0;
        pathsArr.forEach((path) => {
            const pathArray = path[0].split('/');
            if (pathArray[0] === '') {
                pathArray.shift();
            }
            nodeArray = this.InsertNode(pathArray, path[1], path[2], nodeArray);
        });
        return nodeArray;
    }

    InsertNode(pathArray, streamId, sensorId, nodeArray) {
        if (pathArray.length === 1) {
            nodeArray.push({
                text: pathArray[0],
                selectable: true,
                color: '#333',
                id: streamId,
                sensor: sensorId,
            });
            return nodeArray;
        }
        let nodeFound = false;
        for (let i = 0; i < nodeArray.length; i ++) {
            if (pathArray[0] === nodeArray[i].text) {
                pathArray.shift();
                if (nodeArray[i].nodes === undefined) {
                    nodeArray[i].nodes = [];
                }

                nodeArray[i].nodes = this.InsertNode(pathArray, streamId, sensorId, nodeArray[i].nodes);
                nodeFound = true;
            }
        }

        if (nodeFound === false) {
            name = pathArray.shift();
            nodeArray.push({
                text: name,
                selectable: false,
                color: '#333',
                nodes: this.InsertNode(pathArray, streamId, sensorId, []),
            });
            return nodeArray;
        }
        return nodeArray;
    }

    RenderTree(data) {
        $('#my-tree').treeview({
            data: data,
            showBorder: false,
            color: '#333',
            expandIcon: 'glyphicon glyphicon-folder-close glyphs',
            emptyIcon: 'glyphicon glyphicon-minus',
            collapseIcon: 'glyphicon glyphicon-folder-open glyphs',
        });

        $('#my-tree').treeview('collapseAll', {
            silent: true,
        });

        $('#my-tree').on('nodeSelected', (event, data) => {
            if (this.$scope.treeLoaded === false) {
                return;
            }
            this.$scope.$apply(() => {
                console.log(data)
                this.$location.search('ds', data.id);
            });

        });

        $('#my-tree').on('nodeUnselected', (event, data) => {
            console.log('unselected');
        });

        const curStream = parseInt(this.$location.search().ds);
        if (! isNaN(curStream)) {
            for (let i = 0; i < this.$scope.nodeCount; i++) {
                const curNode = $('#my-tree').treeview('getNode', i);
                if ('info' in curNode && curNode.id === curStream) {
                    $('#my-tree').treeview('revealNode', curNode);
                    $('#my-tree').treeview('selectNode', curNode);
                }
            }
        }
        if (data.length === 0) {
            $('#graph-message').toggleClass('alert-danger');
            $('#graph-message').html('There are currently no streams available.');
        }
        // Currently just used to stop a digest cycle for selected nodes,
        // This is also the point at which all other graphs can be loaded.
        // TODO: make this a function that spawns the other widgets.
        this.$scope.treeLoaded = true;
    }
}
