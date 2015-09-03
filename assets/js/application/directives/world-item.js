// app.directive('worldItem', ['$compile', function($compile) {
//     return {
//         link:function($scope, $element) {
//             var render = function() {
//                 var x = (($scope.item.x - $scope.camera.x) * 32);
//                 var y = (($scope.item.y - $scope.camera.y) * 32);
//                 $element.css({
//                     left:   x,
//                     top:    y
//                 });
//             };

//             $element.css({backgroundImage:'url(/items@2x/' + $scope.items[$scope.item.item].sprite + '.gif)'});

//             $($element).bind('mouseenter',function() {
//                 console.log('enter item')
//                 var x = $(this).position().left;
//                 var y = $(this).position().top;

//                 var left = (cameraWidth-3) / 2 * spriteWidth;
//                 var width = left + spriteWidth * 3;
//                 var top = (cameraHeight-3) / 2 * spriteWidth;
//                 var height = top + spriteWidth * 3;

//                 if(x >= left && x <=width && y>= top && y<= height) {
//                     $(this).draggable({
//                         zIndex:250,
//                         cursorAt:{left:16, top:16},
//                         // start:function(e,ui) {
//                         //     $scope.$apply(function() {
//                         //         // $scope.$parent.showDropArea = true;
//                         //         // // $(this).data("oldX",$(this).position().left);
//                         //         // // $(this).data("oldY",$(this).position().top);
//                         //         $($element).css({zIndex:1000});
//                         //         // $droparea.show();
//                         //         $("#inventory .item.stackable").droppable({
//                         //         //     accept:"#inventory .item.stackable",
//                         //         //     drop:function(e,ui){
//                         //         //         socket.send({inventory_stack:{drag:$(this).attr("id").split("_")[1],drop:ui.draggable[0].id.split("_")[1]}})
//                         //         //     }
//                         //         });
//                         //     });
//                         // },
//                         // stop:function(e, ui) {
//                         //     var x = ui.position.left + 16;
//                         //     var y = ui.position.top + 16;
//                         //     var tx = 0;
//                         //     var ty = 0;

//                         //     if(x >= left && x <=width && y>= top && y<= height) {
//                         //         tx = ~~Math.floor(x/spriteWidth) - ~~(cameraWidth / 2);
//                         //         ty = ~~Math.floor(y/spriteHeight) - ~~(cameraHeight / 2);
//                         //         if(tx==0 && ty==0) {
//                         //             // console.log('dropped on me');
//                         //             socket.get('/map/collect', {item:$scope.item.id});
//                         //         } else {
//                         //             console.log(e)
//                         //             // (function(element) {
//                         //                 socket.get('/map/moveItem', {item:$scope.item.id, x:tx, y:ty});
//                         //             // })(e)
//                         //             // console.log('dropped at', tx, ty);
//                         //         }
//                         //     }
//                         // }
//                     })
//                 } else {
//                     if($($element).is('.ui-draggable')) {
//                         $($element).draggable('destroy')
//                     }
//                 }
//             });

//             $scope.$watch('camera.x + camera.y', function(n, o) {
//                 if($($element).is('.ui-draggable')) {
//                     $($element).draggable('destroy');
//                 }
//             });
//         }
//     };
// }]);

// // $('#items .item:not(".not-movable")').bind('mouseenter',function() {
//     //     console.log('enter item')
//     //     var x = $(this).position().left;
//     //     var y = $(this).position().top;

//     //     // todo: use math and screensize to come up with these numbers
//     //     if(x >= 256 && x <=384 && y>= 224 && y<= 288) {
//     //         console.log(x + ', ' + y)
//     //         $(this).draggable({
//     //             zIndex:250,
//     //             start:function(e,ui) {
//     //                 $(this).data("oldX",$(this).position().left);
//     //                 $(this).data("oldY",$(this).position().top);
//     //                 $(this).css({zIndex:1000});
//     //                 $droparea.show();
//     //                 $("#inventory .item.stackable").droppable({
//     //                     accept:"#inventory .item.stackable",
//     //                     drop:function(e,ui){
//     //                         socket.send({inventory_stack:{drag:$(this).attr("id").split("_")[1],drop:ui.draggable[0].id.split("_")[1]}})
//     //                     }
//     //                 });
//     //             }
//     //         })
//     //     } else {
//     //         if($(this).is('.ui-draggable')) {
//     //             $(this).draggable('destroy')
//     //         }
//     //     }
//     // });