$( document ).ready(function() {
    var web3 = new Web3('https://mainnet.infura.io/v3/67b5841e21524cc9b6d47bb88f549acb');
    var meOwContract = "0x3F5A11F69534290458687292Bc72dd96A7130B65";
    
    var meOwAbi = [{"constant":false,"inputs":[{"name":"_username","type":"string"},{"name":"_name","type":"string"},{"name":"_bio","type":"string"},{"name":"_about","type":"string"}],"name":"register","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_username","type":"string"},{"name":"_positive","type":"bool"}],"name":"review","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_username","type":"string"},{"name":"_admin","type":"address"},{"name":"_name","type":"string"},{"name":"_bio","type":"string"},{"name":"_about","type":"string"}],"name":"update","outputs":[{"name":"_status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"profiles","outputs":[{"name":"admin","type":"address"},{"name":"username","type":"string"},{"name":"name","type":"string"},{"name":"bio","type":"string"},{"name":"about","type":"string"},{"name":"positive_counter","type":"uint256"},{"name":"negative_counter","type":"uint256"},{"name":"time","type":"uint256"},{"name":"update_time","type":"uint256"},{"name":"status","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalUsers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"counters","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
    var meOw = new web3.eth.Contract(meOwAbi, meOwContract);
    
    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }
    
    function _error(el, dt){
        if(dt == ""){
            $("._errormsg."+el).text("");
        } else {
            $("._errormsg."+el).text(dt);
        }
        
    }
    
    function _checkValidUname(uname){
        if(uname.length <= 16){
            if(uname.includes(".")){
                if((uname.split(".")).length > 2){
                    return false;
                }
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
    
    
    $(".abtn-icn").click(function(){
        var _positive = 0;
        if($(this).hasClass("pos-icon")){
            _positive = 1;
        }
        
        var _uname = $(".username").data('uname');
        var _data = meOw.methods.review(_uname, _positive).encodeABI();
        
        var _url = "https://vintage.myetherwallet.com/?to="+meOwContract+"&value=0&data="+_data+"#send-transaction";
        openInNewTab(_url);
    });
    
    
    $(".create").click(function(){
        $(".container").hide();
        $(".createbox").show();
    });
    
    $(".edit").click(function(){
        $(".container").hide();
        $(".editbox").show();
    });
    
    $(".search").click(function(){
        var q = $("#q").val();
        if(q !== ""){
            load_profile(q);
        }
    });
    
    $(".create_btn").click(function(){
        _error("cbox", "");
        
        var uname = $("#_i_uname").val();
        var name = $("#_i_name").val();
        var bio = $("#_i_bio").val();
        var about = $("#_i_about").val();
        
        if(uname == ""){
            _error("cbox", "Enter Username");
            return false;
        }
        
        if(!_checkValidUname(uname)){
            _error("cbox", "Invalid Username");
            return false;
        }
        
        if(name == ""){
            _error("cbox", "Enter Name");
            return false;
        }
        
        if(bio == ""){
            _error("cbox", "Enter Bio");
            return false;
        }
        
        if(about == ""){
            _error("cbox", "Enter About");
            return false;
        }
        
        var _data = meOw.methods.register(uname, name, bio, about).encodeABI();
        
        var _url = "https://vintage.myetherwallet.com/?to="+meOwContract+"&value=0&data="+_data+"#send-transaction";
        openInNewTab(_url);
    });
    
    $(".update_btn").click(function(){
        _error("ebox", "");
        
        var uname = $(".username").data('uname');
        var address = $("#_e_address").val();
        var name = $("#_e_name").val();
        var bio = $("#_e_bio").val();
        var about = $("#_e_about").val();
        
        if(address == ""){
            _error("ebox", "Enter Address");
            return false;
        }
        
        if(name == ""){
            _error("ebox", "Enter Name");
            return false;
        }
        
        if(bio == ""){
            _error("ebox", "Enter Bio");
            return false;
        }
        
        if(about == ""){
            _error("ebox", "Enter About");
            return false;
        }
        
        var _data = meOw.methods.update(uname, address, name, bio, about).encodeABI();
        
        var _url = "https://vintage.myetherwallet.com/?to="+meOwContract+"&value=0&data="+_data+"#send-transaction";
        openInNewTab(_url);
    });
    
    function load(){
        var lhash = location.hash;
        
        if(lhash == ''){
            var uname = "openweb";
        } else {
            var uname = lhash.substr(1);
        }
        
        load_profile(uname);
        
        
        meOw.methods.totalUsers().call(function(err1, _dt){
            $(".tot b").text(_dt);
        });
    }
    
    function load_profile(uname){
        history.pushState(null, null, '#'+uname);
        
        $("#_e_address").val("-");
        $("#_e_name").val("-");
        $("#_e_bio").val("-");
        $("#_e_about").val("-");


        $(".name").text("-");
        $(".username").text("-");
        $(".username").data('uname', "");
        $(".address").text("-");
        $(".short").text("-");
        $(".about").text("-");

        $(".pos").text("0");
        $(".neg").text("0");
        
        var unameBytes = web3.utils.fromAscii(uname);
        meOw.methods.profiles(unameBytes).call(function(err1, _pdt){
            
            $("#_e_address").val(_pdt.admin);
            $("#_e_name").val(_pdt.name);
            $("#_e_bio").val(_pdt.bio);
            $("#_e_about").val(_pdt.about);
            
            
            $(".name").text(_pdt.name);
            $(".username").text("@"+uname);
            $(".username").data('uname', uname);
            $(".address").text(_pdt.admin);
            $(".short").text(_pdt.bio);
            $(".about").text(_pdt.about);
            
            $(".pos").text(_pdt.positive_counter);
            $(".neg").text(_pdt.negative_counter);
        });
    }
    
    
    load();
});
