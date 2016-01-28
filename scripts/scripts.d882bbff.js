"use strict";angular.module("hwrChatApp",["ngCookies","ui.router","ngMaterial","LocalStorageModule","luegg.directives","sun.scrollable","pascalprecht.translate","ngEmbed","restangular"]).config(["$stateProvider","$urlRouterProvider","$windowProvider","$mdThemingProvider","$translateProvider","$httpProvider","RestangularProvider","$locationProvider",function(a,b,c,d,e,f,g,h){g.setBaseUrl("https://hwr-chat-backend.herokuapp.com/api/"),h.html5Mode(!1),b.otherwise("/"),a.state("layout_small",{templateUrl:"views/layout/"+(c.$get().innerWidth<600?"mobile":"desktop")+".html"}).state("layout_2screens",{templateUrl:"views/layout/2screen_"+(c.$get().innerWidth<600?"mobile":"desktop")+".html"}).state("layout_small.login",{url:"/login",views:{content:{templateUrl:"views/login.html",controller:"LoginCtrl"},submenu:{templateUrl:"views/subMenu.html"}}}).state("layout_small.register",{url:"/register",views:{content:{templateUrl:"views/register.html",controller:"RegisterCtrl"}}}).state("layout_small.newchat",{url:"/newchat",views:{content:{templateUrl:"views/newChat.html",controller:"NewChatCtrl"}}}).state("layout_small.newchatDialog",{url:"/newchatDialog",views:{content:{templateUrl:"views/newChatDialog.html",controller:"NewChatCtrl"}}}).state("layout_small.newgroup",{url:"/newgroup",views:{content:{templateUrl:"views/newGroup.html",controller:"NewGroupCtrl"}}}).state("layout_2screens.contacts",{url:"/chat",views:{left:{templateUrl:"views/contacts.html",controller:"ContactsCtrl"},single:{templateUrl:"views/contacts.html",controller:"ContactsCtrl"}}}).state("layout_2screens.chat",{url:"/chat/:id",views:{left:{templateUrl:"views/contacts.html",controller:"ContactsCtrl"},right:{templateUrl:"views/chat.html",controller:"ChatCtrl"},single:{templateUrl:"views/chat.html",controller:"ChatCtrl"}}}).state("layout_small.forgotpassword",{url:"/password",views:{content:{templateUrl:"views/forgotPassword.html",controller:"ForgotPasswordCtrl"}}}).state("layout_small.info",{url:"/info",views:{content:{templateUrl:"views/info.html",controller:"InfoCtrl"}}}).state("layout_small.settings",{url:"/settings",views:{content:{templateUrl:"views/settings.html",controller:"SettingsCtrl"}}}).state("layout_small.confirm",{url:"/confirm",views:{content:{templateUrl:"views/confirm.html",controller:"ConfirmCtrl"}}}).state("layout_small.deleteaccount",{url:"/deleteaccount",views:{content:{templateUrl:"views/deleteaccount.html",controller:"DeleteaccountCtrl"}}}).state("layout_small.changepw",{url:"/changepw",views:{content:{templateUrl:"views/changepw.html",controller:"ChangepwCtrl"}}}).state("layout_small.renamechat",{url:"/renamechat",views:{content:{templateUrl:"views/renamechat.html",controller:"RenamechatCtrl"}}}),b.otherwise("/login"),e.useStaticFilesLoader({prefix:"lang/",suffix:".json"}),e.preferredLanguage("de_DE"),e.useLocalStorage(),e.useSanitizeValueStrategy("sanitizeParameters"),d.theme("default").primaryPalette("red")}]).run(["$rootScope","$window","screenService","$mdDialog","scrollableConfig","userService",function(a,b,c,d,e,f){f.setHeader(),f.loadData(),e.template='<div class="{nanoClass}" ><div class="{contentClass}" scroll-glue ng-transclude></div></div>';var g=!1;c.setMobileView(c.shouldMobileView()),a.$watch(function(){return c.width()},function(a,e){if(!g&&c.isMobileView()===c.shouldMobileViewByWidth(e)&&c.isMobileView()!==c.shouldMobileView()){var f=d.confirm().title("ansicht wechseln zu "+(c.shouldMobileView()?"mobile":"desktop")).ok("Ja").cancel("nein");g=!0,d.show(f).then(function(){g=!1,b.location.reload()},function(){g=!1})}})}]),angular.module("hwrChatApp").controller("LoginCtrl",["$scope","$mdToast","$filter","$state","Restangular","userService",function(a,b,c,d,e,f){a.user={email:"test@hwr-berlin.de",password:"1234"},a.login=function(){f.login(a.user).then(function(){b.showSimple(c("translate")("AlertLogin")),d.go("layout_2screens.contacts")},function(){b.showSimple(c("translate")("AlertError"))})}}]),angular.module("hwrChatApp").factory("screenService",["$window","$rootScope",function(a,b){b.innerWidth=a.innerWidth,angular.element(a).bind("resize",function(){b.innerWidth=a.innerWidth,b.$apply()});var c=!0;return{width:function(){return b.innerWidth},isMobileView:function(){return c},setMobileView:function(a){c=a},shouldMobileView:function(){return b.innerWidth<600},shouldMobileViewByWidth:function(a){return 600>a}}}]),angular.module("hwrChatApp").controller("RegisterCtrl",["$scope","$state","$mdToast","$filter","Restangular",function(a,b,c,d,e){a.user={lastname:"",firstname$state:"",password:"",email:""},a.confirm={password:""},a.signUP=function(){a.confirm.password===a.user.password&&a.confirm.agree?e.all("accounts").post(a.user).then(function(){c.showSimple(d("translate")("AlertRegister")),b.go("layout_small.login")},function(){c.showSimple(d("translate")("AlertError"))}):a.confirm.agree?c.showSimple(d("translate")("AlertPwIdent")):c.showSimple(d("translate")("AlertSitePolicy"))}}]),angular.module("hwrChatApp").controller("ChatCtrl",["$scope","screenService","$stateParams","$mdDialog","$mdToast","$filter","$state","Restangular","userService","socket",function(a,b,c,d,e,f,g,h,i,j){function k(){a.chat.getList("accounts").then(function(b){a.accounts={},b.forEach(function(b){a.accounts[b.id]=b})})}j.then(function(b){b.on("NewMessages",function(b){b.data.chatId===parseInt(c.id)&&(a.messages.push(b.data),a.$apply())})});var l=0;a.messages=[],a.accounts=[],a.isMobile=b.isMobileView(),i.isLoaded().then(function(){a.userID=i.me().id}),h.one("chats",c.id).get().then(function(b){a.chat=b,a.chat.getList("messages").then(function(b){a.messages=b,l=a.messages[a.messages.length-1].id}),k()}),a.send=function(){""!==a.messageText&&(a.messages.post({content:a.messageText}).then(function(){},function(){e.showSimple(f("translate")("AlertMsgError"))}),a.messageText="")},a.renameChat=function(){function b(a,b,c,d){a.chat=d.copy(b),a.rename=function(){a.chat.save().then(function(){c.hide(a.chat)},function(){c.cancel({err:!0})})},a.cancel=function(){c.cancel()}}b.$inject=["$scope","chat","$mdDialog","Restangular"],d.show({controller:b,templateUrl:"views/renamechat.html",locals:{chat:a.chat},clickOutsideToClose:!0}).then(function(b){a.chat=b},function(a){a.err===!0&&e.showSimple(f("translate")("AlertError"))})},a.leaveChat=function(){i.isLoaded().then(function(){i.me().one("chats/rel",a.chat.id).remove().then(function(){a.chat.all("messages").post({content:i.me().firstname+f("translate")("AlertLeaveChat")}),e.showSimple(f("translate")("AlertLeaveChat")),g.go("layout_2screens.contacts")},function(){e.showSimple(f("translate")("LeftTheChat"))})})},a.showEmojis=function(){},a.openSettings=function(){g.go("layout_small.settings")},a.addUser=function(){function b(a,b,c,d,e,f){a.contacts=e.all("accounts").getList().$object,a.confirmScreen=!1,a.selectedAccount={},a.chat=c,a.filterAlreadyAdded=function(a){return!(a.id.toString()in f)},a.add=function(b){a.confirmScreen=!0,a.selectedAccount=b},a.confirm=function(a){e.one("chats",c.id).one("accounts/rel",a.id).customPUT({}).then(function(){b.post({content:a.firstname+" "+a.lastname+" wurde hinzugefügt."}),d.hide()})},a.cancel=function(){d.cancel()}}b.$inject=["$scope","messages","chat","$mdDialog","Restangular","accounts"],d.show({controller:b,templateUrl:"views/addUser.html",locals:{chat:a.chat,messages:a.messages,accounts:a.accounts},clickOutsideToClose:!0}).then(function(){k()},function(){})}}]),angular.module("hwrChatApp").controller("ContactsCtrl",["$scope","screenService","$mdSidenav","userService","$state","$mdToast","$filter","socket",function(a,b,c,d,e,f,g,h){function i(){d.me().getList("chats").then(function(b){a.chats=b})}h.then(function(b){b.on("NewChat",function(){i()}),b.on("NewMessages",function(b){for(var c=0;c<a.chats.length;c++)if(a.chats[c].id===b.data.chatId)return void(a.chats[c].lastMessage=b.data.createdAt)})}),a.chats=[];var j=null;d.isLoaded().then(function(){a.user=d.me(),j=!0,i()},function(){e.go("layout_small.login")}),a.isMobile=b.isMobileView(),a.openSideNav=function(){c("left").toggle()},a.openChat=function(a){e.go("layout_2screens.chat",{id:a})},a.logout=function(){d.isLoaded().then(function(){d.logout(),j=!1}),f.showSimple(g("translate")("AlertLogout")),e.go("layout_small.login")}}]),angular.module("hwrChatApp").controller("ForgotPasswordCtrl",["$scope","$state","$mdToast","$filter","Restangular",function(a,b,c,d,e){a.user={email:""},a.sendResetPasswordMail=function(){e.all("accounts").customPOST(a.user,"reset").then(function(){c.showSimple(d("translate")("AlertEmailSent")),b.go("layout_small.login")},function(){c.showSimple(d("translate")("AlertEmailError"))})}}]),angular.module("hwrChatApp").controller("SettingsCtrl",["$scope","userService","$mdToast","$filter",function(a,b,c,d){a.user=b.me(),console.log(a.user),a.confirmPwPopup=!1,a.save=function(){a.confirmPwPopup===!0?b.validatePassword(a.user.passwordConfirm).then(function(e){e.result===!0?(console.log(e),a.user.put().then(function(){a.user.passwordConfirm="",a.confirmPwPopup=!1,c.showSimple(d("translate")("AlertChange"))},function(){b.loadData().then(function(b){a.user=b}),a.confirmPwPopup=!1})):(b.loadData().then(function(b){a.user=b}),a.confirmPwPopup=!1,c.showSimple(d("translate")("AlertPwWrong")))}):a.confirmPwPopup=!0}}]),angular.module("hwrChatApp").controller("ChangepwCtrl",["$scope","userService","$mdToast","$filter",function(a,b,c,d){a.user={oldPW:"",newPW:"",confirmNewPW:""},a.confirm=function(){b.validatePassword(a.user.oldPW).then(function(e){e.result===!0&&a.user.newPW===a.user.confirmNewPW?(b.me().password=a.user.newPW,b.me().put().then(function(a){console.log(a),c.showSimple(d("translate")("AlertPwChange"))},function(){c.showSimple(d("translate")("AlertServerRequest"))})):c.showSimple(d("translate")("AlertInputError"))})}}]),angular.module("hwrChatApp").controller("NewChatCtrl",["$scope","screenService","$mdSidenav","Restangular","$mdToast","$filter","userService","$state","$mdDialog",function(a,b,c,d,e,f,g,h,i){a.isMobile=b.isMobileView(),a.openSideNav=function(){c("left").toggle()},a.contacts=d.all("accounts").getList().$object,a.selectedAccounts=[],a.addUser=function(b){a.selectedAccounts.push(b)},a.removeUser=function(b){var c=a.selectedAccounts.indexOf(b);a.selectedAccounts.splice(c,1)},a.createChat=function(){function b(a,b,c){a.createChat=function(){g.me().all("chats").post({name:a.name,isGroup:!0}).then(function(a){angular.forEach(b,function(b){d.one("chats",a.id).one("accounts/rel",b.id).customPUT({})}),d.one("chats",a.id).all("messages").post({accountId:g.me().id,content:f("translate")("MessageGroupCreate",{account:g.me().firstname,chat:a.name})}).then(function(){c.hide(a)},function(){c.cancel()})},function(){c.cancel()})},a.closeDialog=function(){c.cancel()}}var c=a.selectedAccounts.length;switch(b.$inject=["$scope","accounts","$mdDialog"],c){case 0:e.showSimple(f("translate")("AlertContactError"));break;case 1:g.me().getList("chats").then(function(b){for(var c=0;c<b.length;c++)if(b[c].accountId===a.selectedAccounts[0].id)return h.go("layout_2screens.chat",{id:b[c].id});g.me().all("chats").post({name:a.selectedAccounts[0].firstname+" "+a.selectedAccounts[0].lastname,isGroup:!1}).then(function(b){d.one("chats",b.id).one("accounts/rel",a.selectedAccounts[0].id).customPUT({}),h.go("layout_2screens.chat",{id:b.id}),d.one("chats",b.id).all("messages").post({accountId:g.me().id,content:f("translate")("MessageGroupCreate",{account:g.me().firstname,chat:b.name})}).then(function(){i.hide(b)},function(){i.cancel()})},function(){e.showSimple(f("translate")("AlertNetworkError"))})});break;default:i.show({controller:b,templateUrl:"views/newchatDialog.html",locals:{accounts:a.selectedAccounts},clickOutsideToClose:!0}).then(function(a){h.go("layout_2screens.chat",{id:a.id})},function(){e.showSimple(f("translate")("AlertError"))})}},a.filterAlreadyAdded=function(b){return a.selectedAccounts.indexOf(b)<0},a.filterOwnUser=function(a){return a.id!==g.me().id}}]),angular.module("hwrChatApp").directive("langBox",["$translate",function(a){return{templateUrl:"views/directives/langbox.html",restrict:"E",link:function(b){b.languageSelect=a.use(),b.languages=[{name:"Deutsch",id:"de_DE"},{name:"English",id:"en_US"}],b.changeLang=function(b){a.use(b).then(function(a){console.log("Sprache zu "+a+" gewechselt.")},function(){console.log("Irgendwas lief schief.")})}}}}]),angular.module("hwrChatApp").factory("userService",["Restangular","$q",function(a,b){var c={token:null,id:null,data:{}};return c.loadData=function(){return b(function(b,d){var e=localStorage.getItem("id");null===e?d():a.one("accounts",e).get().then(function(a){c.data=a,b(a)},d)})},c.isLoaded=function(){return b(function(a,b){angular.equals(c.data,{})?c.loadData().then(a,b):a()})},c.login=function(d){var e=b.defer();return a.all("accounts").customPOST(d,"login").then(function(a){c.token=a.id,localStorage.setItem("token",c.token),localStorage.setItem("id",a.userId),c.setHeader(),c.loadData().then(function(){e.resolve()},function(){e.reject()})},function(){e.reject()}),e.promise},c.me=function(){return c.data},c.setHeader=function(){null===c.token&&(c.token=localStorage.getItem("token")),a.setDefaultHeaders({Authorization:c.token})},c.logout=function(){localStorage.removeItem("token"),localStorage.removeItem("id"),c.token=null,c.id=null,c.data={},a.setDefaultHeaders()},c.isLoggedIn=function(){return null!==c.token},c.validatePassword=function(b){return a.all("accounts").customPOST({id:c.me().id,password:b},"validatePassword")},c}]),angular.module("hwrChatApp").controller("DeleteaccountCtrl",["$scope","userService","$mdToast","$filter","$state",function(a,b,c,d,e){a.user={pw:""},a.confirmDeleteAccount=function(){b.validatePassword(a.user.pw).then(function(a){a.result===!0?b.me().remove().then(function(){c.showSimple(d("translate")("AlertAccDeleted")),e.go("layout_small.login")},function(){c.showSimple(d("translate")("AlertError"))}):c.showSimple(d("translate")("AlertPwWrong"))})}}]),angular.module("hwrChatApp").controller("InfoCtrl",["$scope","userService","$state",function(a,b,c){a.back=function(){b.isLoaded().then(function(){b.isLoggedIn()?c.go("layout_2screens.contacts"):c.go("layout_small.login")},function(){c.go("layout_small.login")})}}]),angular.module("hwrChatApp").factory("socket",["userService","$q",function(a,b){return b(function(b){a.isLoaded().then(function(){var c=io.connect("http://localhost:3000");b(c);var d=a.token,e=a.me().id;c.on("connect",function(){c.emit("authentication",{id:d,userId:e}),c.on("authenticated",function(){console.log("User is authenticated")})})})})}]),angular.module("hwrChatApp").directive("account",function(){return{template:"<div>{{account.firstname}} {{account.lastname}}</div>",restrict:"E",scope:{account:"=account"}}}),angular.module("hwrChatApp").directive("ngEnter",function(){return function(a,b,c){b.bind("keydown keypress",function(b){b.ctrlKey||b.shiftKey||13===b.which&&(a.$apply(function(){a.$eval(c.ngEnter)}),b.preventDefault())})}});