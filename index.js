//click 切换样式
angular.module('directives').directive('ngToggleClass',function(){
     return {
        restrict: 'A',
        replace: false,
        link:function(scope, element, attrs){
              var spt=attrs.ngToggleClass.split(',');
              var cls=spt[0];
              element.on("click",function(){
                   if(element.hasClass(cls)){
                       element.removeClass(cls) ;
                   }else{
                       element.addClass(cls) ;
                   }
              });
        }
    };
});
//click 切换卡片
angular.module('directives').directive('ngToggleCard',function(){
     return {
        restrict: 'A',
        replace: false,
        link:function(scope, element, attrs){
              var spt=attrs.ngToggleCard.split(',');
              var cls=spt[0];
              element.on('click',function(){
                   if(element.hasClass(cls)){
                       element.removeClass(cls) ;

                       setTimeout(function(){
                           element.parent("li").css("zIndex",9);
                       },300)
                   }else{
                       element.addClass(cls) ;
                       element.parent("li").css("zIndex",10);

                   }
              });
        }
    };
});
//关系指数对上的标签类型转义
angular.module('directives').directive('ngMachupToTab',function(){
     return {
        restrict: 'A',
        scope:true,
        link:function(scope, element, attrs){
              var type=parseInt(attrs.ngMachupToTab);
              var text=null;
              if(type==4){
                  text="行业";
              }if(type==6){
                  text="距离较近，可常来往";
              }else if(type==15){
                  text="校友";
              }else if(type==18){
                  text="供需相关";
              }else if(type==14){
                  text="老乡";
              }else if(type==19){
                  text="有资源协作";
              }else if(type==11){
                  text="所属团体";
              }else if(type==21){
                  text="有共同关注领域";
              }else if(type==17){
                  text="业务相关";
              }else if(type==20){
                  text="个人爱好";
              }
              element.text(text);
        }
    };
});
//通过子元素的个数计算容器的宽度
angular.module('directives').directive('ngBoxWidth',function(){
     return {
        restrict: 'A',
        scope:true,
        link:function(scope, element, attrs){
              var childlength=parseInt(attrs.ngBoxWidth);
              var childwidth=parseInt(attrs.childwidth);
              var parrentwidth=childlength*(childwidth+10);
              element.css("width",parrentwidth);
        }
    };
});

//判断repeat是否渲染完成
angular.module('directives').directive('ngLastRepeat',function(){
     return {
        restrict: 'A',
        scope:true,
        link:function(scope, element, attrs){
                var str=attrs.ngLastRepeat;
                if(scope.$last){
                  setTimeout(function(){
                       scope.$emit(str);
                  },1)
                }
        }
    };
});

//填写家乡
angular.module('directives').directive('ngFillinModuleNative',["Account","DS_pop",function(Account,DS_pop){
     return {
        restrict: 'A',
        scope:true,
         templateUrl:"/static/apps/tpl/directive_tpl/fillin-module-native.html?7786343",
        link:function(scope, element, attrs){
             var str="";
             var that=scope;
             scope.currentPop="";
             //scope.currentProId=1;
             scope.currentCity=[];
             scope.toggleNative=true;
             scope.title="填写家乡";
             scope.Province=[];
             scope.City=[];
             scope.$on("showNativePop",function(a,b){
                 scope.broadcast_calllback= b.callback;
                 scope.showChoose_NativePop=true;
                 var getProvinceCallback=function(data){
                        scope.Province=data;
                  };
                  var getCityCallback=function(data){
                       scope.City=data;
                       var len=scope.City.length;
                       for(var i=0;i<len;i++) {
                           if(scope.City[i].ProID==scope.currentProId){
                               scope.currentCity.push(scope.City[i]);
                           }
                       }
                  };
                 if(scope.Province.length==0){
                       Account.getProvinceData(getProvinceCallback);
                 }
                 if(scope.City.length==0){
                      Account.getCityData(getCityCallback);
                 }

            });
            scope.checkedCity=function(a,b){
                   scope.HomeProvinceStr=a;
                   scope.HomeCityStr=b;
             };
            scope.switchProvince=function(id){
                  if(scope.toggleNative && id==scope.currentProId){
                      scope.toggleNative=false;
                  }else{
                      scope.toggleNative=true;
                  }
                  scope.currentProId=id;
                  var len=scope.City.length;
                  var str="";
                  scope.currentCity.length=0;
                   for(var i=0;i<len;i++) {
                       if(scope.City[i].ProID==scope.currentProId){
                           scope.currentCity.push(scope.City[i]);
                       }
                   }

             };
             scope.back=function(){
                 scope.showChoose_NativePop=false;
             };
             scope.complete=function(){
                 var o=Account.commitInfos_format(14,null,scope.HomeProvinceStr,scope.HomeCityStr);
                 if(!scope.HomeCityStr || scope.HomeCityStr=="未填写"){
                     scope.showChoose_NativePop=false;
                     return ;
                 }
                 var callback = function (data) {
                     if(data.result.errCode==0){
                          scope.broadcast_calllback(scope.HomeProvinceStr,scope.HomeCityStr);
                          DS_pop.pop_remind("保存成功","40%","40%");
                          scope.showChoose_NativePop=false;
                     }
                 };
                 Account.commitInfos(callback, [o]);
             }
        }
    };
}])
//填写行业
angular.module('directives').directive('ngFillinModuleDomain',["Account","DS_pop",function(Account,DS_pop){
     return {
        restrict: 'A',
        scope:true,
        templateUrl:"/static/apps/tpl/directive_tpl/fillin-module-domain.html?2425843",
        link:function(scope, element, attrs) {
             var callback="";
             scope.$on("showDomainPop",function(a,b){
                   scope.typeId= b.typeId;
                   scope.callback= b.callback;
                   scope.showChoose_DomainPop=true;
             });

             scope.domain=["金融/投资/理财/保险","文化/传媒/广告/演艺","计算机/互联网/通讯","餐饮/旅游/娱乐/体育及服务业","房地产/建筑/装潢",
             "医疗/健康/生物工程","教育/科研/培训","法律/会计/咨询/服务","政府/公共服务/协会社团/非营利机构/商会",
             "国内外贸易","汽车/能源/冶金/机械/制造/化工/重工业","纺织/食品/家电/日化/印刷/轻工业","交通运输物流","农林牧渔"];
             scope.curSecDomain=[];
             scope.secDomain=[];
             //scope.currentDomain="生活&消费服务业";
             scope.toggleDomain=true;
             scope.closeChoosePop=function(){
                scope.showChoose_DomainPop=false;
             };
             var getDomainCallback=function(data){
                 scope.secDomain=data;
                 scope.curSecDomain.length=0;
                 var len=scope.secDomain.length;
                 for(var i=0;i<len;i++){
                     if(scope.secDomain[i].domain==scope.currentDomain){
                         scope.curSecDomain.push(scope.secDomain[i].secDomain);
                     }
                 }
             };
             Account.getDomainData(getDomainCallback);
             scope.switchDomain=function(str){
                 if(scope.toggleDomain && str==scope.currentDomain){
                      scope.toggleDomain=false;
                  }else{
                      scope.toggleDomain=true;
                  }
                 scope.currentDomain=str;
                 scope.curSecDomain.length=0;
                 for(var i=0;i<scope.secDomain.length;i++){
                     if(scope.secDomain[i].domain==str){
                         scope.curSecDomain.push(scope.secDomain[i].secDomain);
                     }
                 }
             };
             scope.checkedDomain=function(str){
                 scope.DomainStr=str;

             };
             scope.back=function(){
                 scope.showChoose_DomainPop=false;
             };
             scope.complete=function() {
                 var o = Account.commitInfos_format(4, 0, scope.DomainStr, scope.DomainStr);
                 var callback = function (data) {
                     if(data.result.errCode==0){
                          scope.callback(scope.DomainStr);
                          DS_pop.pop_remind("保存成功","40%","40%");
                          scope.showChoose_DomainPop = false;
                     }

                 };
                 if(scope.DomainStr && scope.DomainStr !="未填写"){
                     Account.commitInfos(callback, [o]);
                 }else{
                     scope.showChoose_DomainPop = false;
                 }

             }
        }
    };
}]);
//填写学校
angular.module('directives').directive('ngFillinModuleSchool',["Account","DS_pop",function(Account,DS_pop){
     return {
        restrict: 'A',
        scope:true,
         templateUrl:"/static/apps/tpl/directive_tpl/fillin-module-school.html?833365",
        link:function(scope, element, attrs) {
             var callback="";
             var that=scope;
             scope.checked=[];
             scope.domainKeywords_raw=[];
             scope.flag_index=0;
             scope.searchResult_school=[];
             var callback=function(data){
                 scope.schools=data;
             };
             Account.getSchoolData(callback);
             scope.$on("showSchoolPop",function(a,d){
                   scope.showChoose_SchoolPop=true;
                   if(d){
                       scope.checked= d.checked;
                       scope.title=d.title;
                       scope.domainKeywords_raw= d.data;
                   }else{
                       scope.checked=[];
                   }
                   scope.broadcast_callback= d.callback;
                   scope.typeId= d.typeId;
                   var len=scope.checked.length;
                   scope.flag_index=len;
                   for(var i=0; i<len;i++){
                       var s="schoolInput_str"+i;
                       scope[s]=scope.checked[i];
                   }
             });
             scope.Btn_click=function(){
                   if(scope.flag_index>=3){
                        DS_pop.pop_remind("最多可填写3个学校","30%","40%");
                        $(".schoolKeywords_Btn").css("opacity",0.8);
                        return false;
                   }
                   $(".schoolKeywords_Btn").css("opacity",1);
                   scope.flag_index++;
             };
             scope.switchSchool=function(str,index){
                  scope.schoolKeywords_list_top=index;
                  if(str.length==0){
                       scope.searchResult_school.length=0;
                       return false;
                  }
                  var len=scope.schools.length;
                  scope.searchResult_school.length=0;
                  for(var i=0;i<len;i++){
                       if(scope.schools[i].collegeName.indexOf(str)>=0){
                             scope.searchResult_school.push(scope.schools[i]);
                       }
                  }

             };
             scope.checkedSchool=function(str){
                 if(scope.schoolKeywords_list_top==0){
                     scope.schoolInput_str0=str;
                 }else if(scope.schoolKeywords_list_top==1){
                     scope.schoolInput_str1=str;
                 }else if(scope.schoolKeywords_list_top==2){
                     scope.schoolInput_str2=str;
                 }
                 scope.searchResult_school.length=0;
            };
            scope.complete=function(){
                 var arr=[];
                 if(scope.schoolInput_str0 && scope.schoolInput_str0!=''){
                     arr.push(scope.schoolInput_str0);
                 }
                 if(scope.schoolInput_str1 && scope.schoolInput_str1!=''){
                     arr.push(scope.schoolInput_str1);
                 }
                 if(scope.schoolInput_str2 && scope.schoolInput_str2!=''){
                     arr.push(scope.schoolInput_str2);
                 }
                 var commit_callback=function(data){
                      if(data.result.errCode==0){
                           scope.showChoose_SchoolPop=false;
                           DS_pop.pop_remind("保存成功","40%","40%");
                           scope.broadcast_callback(arr);
                      }
                 }
                 var o=Account.commitInfos_format(15,0,arr);
                 if(arr.length > 0){
                       Account.commitInfos(commit_callback,[o]);
                 }else{
                       scope.showChoose_SchoolPop=false;
                 }

            };



             scope.back=function(){
                 scope.showChoose_SchoolPop=false;
            }

        }
    };
}]);
//填写信息共用指令1（共同需求、关注领域、共同爱好等）
angular.module('directives').directive('ngFillinModule1',["Account","DS_pop",function(Account,DS_pop){
     return {
        restrict: 'A',
        scope:true,
        templateUrl:"/static/apps/tpl/directive_tpl/fillin_module1.html?8853686",
        link:function(scope, element, attrs) {
             var that=scope;
             scope.checked=[];
             scope.raw=[];
             scope.$on("showFillinModule1Pop",function(a,d){
                   scope.flag_FillinModule1=true;
                   if(d){
                       scope.checked= d.checked;
                       scope.title=d.title;
                       scope.typeId=d.typeId;
                       scope.raw= d.data;
                       scope.broadcast_callback= d.callback;
                       for(var i=0;i<d.checked.length;i++){
                           var flag1=false;
                           for(var j=0;j<d.data.length;j++){
                               if(d.checked[i]==d.data[j]){
                                    flag1=true;
                               }
                           }
                           if(!flag1){
                               scope.raw.splice(0,0,d.checked[i]);
                           }
                       }
                   }else{
                       scope.checked=[];
                   }
             });



             scope.add=function(str){
                 var len=scope.checked.length;

                 var flag=false;
                 var index=0;
                 for(var i=0;i<len;i++){
                    if(scope.checked[i]==str){
                         flag=true;
                         index=i;
                    }
                 }
                 if(len>=5 && !flag){
                     DS_pop.pop_remind("最多可选5个字段","35%","40%");
                     return false;
                 }
                if(flag){
                     scope.checked.splice(index,1);
                }else{
                     if(scope.title=="职位"){
                          scope.checked.splice(0,1,str);
                     }else{
                          scope.checked.push(str);
                     }
                }
            };
             scope.delete=function(index){
                 scope.checked.splice(index,1);
            };
             scope.class=function(str){
                var len=scope.checked.length;
                for(var i=0;i<len;i++){
                    if(scope.checked[i]==str){
                        return "cur";
                    }
                }
                return "";
            };
             scope.input_str="";
             scope.input=function(str){
                 var str=str;
                 if(str==""){return false;}
                 var len=this.checked.length;
                 if(len>=5){
                     DS_pop.pop_remind("最多可选5个字段","30%","40%");
                     return false;
                 }
                var flag=false;
                 var flag2=false;
                for(var i=0;i<this.raw.length;i++){
                    if(this.raw[i]==str){
                         flag=true;
                         break;
                    }
                }
                for(var i=0;i<len;i++){
                    if(this.checked[i]==str){
                         flag2=true;
                         break;
                    }
                }
                if(!flag && !flag2){
                     if(scope.title=="职位"){
                          this.checked.splice(0,1,str);
                          this.raw.splice(0,1,str);
                     }else{
                          this.checked.push(str);
                          this.raw.splice(0,0,str);
                     }
                }else if(flag && !flag2){
                     if(scope.title=="职位"){
                          this.checked.splice(0,1,str);
                     }else{
                          this.checked.push(str);
                     }
                }
                this.input_str="";
            };
            scope.back=function(){
                 scope.flag_FillinModule1=false;
            };
            scope.complete=function(){
                 var o=Account.commitInfos_format(scope.typeId,null,scope.checked);
                 var commit_callback=function(data){
                      if(data.result.errCode==0){
                           scope.flag_FillinModule1=false;
                           DS_pop.pop_remind("保存成功","40%","40%");
                           scope.broadcast_callback(scope.checked);
                      }
                 }
                 if(scope.typeId==3){
                     o=Account.commitInfos_format(scope.typeId,0,this.checked[0]);
                 }
                 Account.commitInfos(commit_callback,[o]);

            };
            scope.show_input=function(){
                 var placeholderStr='填写'+scope.title;
                 var obj={};
                 obj.title="信息填写";

                 obj.con="<input type='text' placeholder="+placeholderStr+"  maxlength='10'>";
                 var callback=function(val){
                      if(val!="confirm" && val!="cancel"){
                          scope.$apply(function(){
                               scope.input(val);
                          })
                      }
                 };
                 DS_pop.pop_prompt(callback,obj);
            }
        }
    };
}])
//填写当下textarea框
angular.module("directives").directive("ngFillinTextarea",["Account",function(Account){
     return {
         "restrict":"A",
         "scope":true,
         "templateUrl":"/static/apps/tpl/directive_tpl/choose-textarea.html?824438",
         "link":function(scope,element,attrs){
               scope.$on("broadcast_directive_textarea_pop",function(a,b){
                    scope.fillin_textarea_pop=true;
                    scope.obj=b;
                    if(scope.obj.title){
                         scope.title= scope.obj.title;
                    }
                    scope.init();
                    //element.find("m_textarea_style").focus();
                    scope.num=scope.obj.value.length;
               });
               scope.init=function(){

               }
               scope.back=function(){
                    scope.fillin_textarea_pop=false;
               }
               scope.complete=function(){
                    var o={};
                    o.typeId=scope.obj.typeId;
                    o.valueStr=scope.obj.value;
                    if(scope.obj.typeId==16){
                         var callback=function(data){
                                if(data.result.errCode==0){
                                     if(scope.obj.callback){
                                          scope.fillin_textarea_pop=false;
                                          scope.obj.callback(scope.obj.value);
                                     }
                                }

                         }
                         Account.commitInfos(callback,[o]);
                         return ;
                    }
                    if(scope.obj.callback){
                          scope.fillin_textarea_pop=false;
                          scope.obj.callback(scope.obj.value);
                    }
               }
               scope.recordNumber=function(){
                    scope.num=scope.obj.value.length;
               }
          }
     }
}])
