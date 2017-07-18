export default class treeController {
    constructor($scope, $location, $http, $compile, $timeout) {
        'ngInject';

        $scope.pathSetSelection = $location.search().pathSet;
        if ($scope.pathSetSelection === undefined) {
            $scope.pathSetSelection = 0;
        }

        function MakeTreeStructure(data, stream, curUrl, pathId) {
            if (curUrl.length <= 1) {
                if (!(curUrl[0] in data)) {
                    data[curUrl[0]] = [];
                }
                stream.pathId = pathId;
                data[curUrl[0]].push(stream);
                return data;
            }
            if (!(curUrl[0] in data)) {
                data[curUrl[0]] = {};
            }
            const temp = curUrl.shift();
            data[temp] = MakeTreeStructure(data[temp], stream, curUrl, pathId);
            return data;
        }

        function SelectTreeNode(info) {
            if (info === undefined) {
                return;
            }
            // infoService.resetStreamInfo();
            // infoService.setStreamInfo(info);
            $timeout(() => {
                $scope.$apply(() => {
                    $location.search('ds', info.id);
                });
            });
        }

        function GetTree(data) {
            const arr = [];
            data.forEach((i) => {
                $scope.nodeCount++;
                const newObj = {
                    color: '#333',
                };
                if (data.constructor === Array) {
                    newObj.info = i;
                    newObj.text = i.name;
                    newObj.selectable = true;
                } else {
                    newObj.text = i;
                    newObj.nodes = GetTree(i);
                    newObj.selectable = false;
                }
                arr.push(newObj);
            });
            return arr;
        }

        function BuildPathSetWidget(data) {
            let val = 0;
            data.forEach((a) => {
                if (a.paths.length > val) {
                    val = a.paths.length;
                }
            });
            if (val <= 1) {
                return;
            }
            let wrapper = '<nav aria-label="Page navigation"><ul class="pagination">';
            let currentSet = $location.search().pathSet;
            if (currentSet === undefined) {
                currentSet = 1;
            }
            for (let i = 0; i < val; i++) {
                if (i > 7) {
                    // make arrows and break;
                    break;
                }
                let newButton = '<li><button class="btn btn-default';
                if (currentSet - 1 === i) {
                    newButton += ' active';
                }
                newButton += '" ng-click=ChangePath(' + (i + 1) + ')>' + (i + 1) + '</button></li>';
                wrapper += newButton;
            }
            angular.element('#pathSetPaginator').html('');

            angular.element('#pathSetPaginator').append($compile(wrapper)($scope));
        }

        function RequestTree() {
            let pathSetId = $location.search().pathSet - 1;
            if (isNaN(pathSetId)) {
                pathSetId = 0;
            }
            $http.get('getTree').then((response) => {
                const streams = response.data.datastreams;

                let data = {};

                streams.forEach((a) => {
                    a.paths.forEach((b) => {
                        if (parseInt(b) !== pathSetId) {
                            return;
                        }
                        const curUrl = streams[a].paths[b].split('/');
                        curUrl.shift();
                        data = MakeTreeStructure(data, streams[a], curUrl, b);
                    });
                });

                $scope.nodeCount = 0;

                $('#myTree').treeview({
                    data: GetTree(data),
                    showBorder: false,
                    color: '#333',
                    expandIcon: 'glyphicon glyphicon-folder-close glyphs',
                    emptyIcon: 'glyphicon glyphicon-minus',
                    collapseIcon: 'glyphicon glyphicon-folder-open glyphs',

                });
                $('#myTree').treeview('collapseAll', {
                    silent: true,
                });
                BuildPathSetWidget(response.data.datastreams);
                const curStream = $location.search().ds;

                let currentPathSet = $location.search().pathSet;
                if (currentPathSet === undefined) {
                    currentPathSet = 1;
                }

                if (curStream !== undefined) {
                    for (let c = 0; c < $scope.nodeCount; c++) {
                        const curNode = $('#myTree').treeview('getNode', c);
                        if ('info' in curNode && curNode.info.id === parseInt(curStream)) {
                            $('#myTree').treeview('revealNode', curNode);
                            $('#myTree').treeview('selectNode', curNode);
                            SelectTreeNode(curNode.info);
                        }
                    }
                }

                $('#myTree').on('nodeSelected', (event, data) => {
                    if (data.info === undefined) {
                        $('#myTree').treeview('expandNode', [data.nodeId, {
                            levels: 2,
                            silent: true,
                        }]);
                    } else {
                        SelectTreeNode(data.info);
                    }
                });

                $('#myTree').on('nodeUnselected', (event, data) => {
                    if (data.info === undefined) {
                        $('#myTree').treeview('collapseNode', [data.nodeId, {
                            levels: 2,
                            ignoreChildren: false,
                        }]);
                    }
                });

                if (streams.length === 0) {
                    $('#myTree').text('There are currently no streams available.');
                }

            }, (error) => {
                console.log('error occured: ' + error);
            });
        }

        $scope.ChangePath = (e) => {
            if (e === 'next') {
                e = $scope.pathSetSelection + 1;
            }
            if (e === 'previous') {
                e = $scope.pathSetSelection - 1;
            }
            $scope.pathSetSelection = e;
            $location.search('pathSet', e);

            RequestTree();
        };

        $scope.$on('$routeUpdate', () => {
            const nodeFound = false;
            let i = 0;
            const ds = $location.search().ds;
            if (ds === undefined) {
                $location.search('ds', 1);
                return;
            }
            const source = $location.search().source;
            if (ds === undefined && source === undefined) {
                return;
            }
            while (!nodeFound && i < 500) {
                i++;
                const node = $('#myTree').treeview('getNode', i);
                if (node.info === undefined) {
                    continue;
                }
                if (source !== node.info.source) {
                    continue;
                }
                if (parseInt(ds) !== parseInt(node.info.id)) {
                    continue;
                }
                $('#myTree').treeview('selectNode', [i, {
                    silent: true,
                }]);
                $('#myTree').treeview('revealNode', [i, {
                    silent: true,
                }]);
                // infoService.resetStreamInfo();
                // infoService.setStreamInfo(node.info);
                break;
            }
        });

        RequestTree();
    }
}
