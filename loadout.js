var assocIn = function (m, ks, v){
    if(!m){
        m = {};
    }
    if(ks.length > 1){
        m[ks[0]] =  assocIn(m[ks[0]], ks.splice(1), v);
    }
    else{
        if(ks.length == 1){
            m[ks[0]] = v;
        }
    }
    return m;
};

$("body").append("<div id='stickyKits'><p>Make sticky</p><div data-id='0'>ASSAULT</div><div data-id='1'>ENGINEER</div><div data-id='2'>SUPPORT</div><div data-id='3'>RECON</div></div>");

$("#stickyKits div").live("click", function(){
	battleloginfo.changeKit($(this).attr("data-id"));
});

var battleloginfo = {};

battleloginfo.getCurrentLoadout = function(){
	if(loadout != null && loadout.getModel != null){
		var model = loadout.getModel();
		if(model.get != null){
			var currentLoadout = model.get("loadout");
			if(currentLoadout != null){
				battleloginfo.lastSeenKit = currentLoadout.selectedKit;
				return currentLoadout;
			}
		}
	}
}

battleloginfo.changeKitTrys = 0;
battleloginfo.changeKit = function(id){
	if(id != null){
		var currentLoadout = battleloginfo.getCurrentLoadout();
		if(currentLoadout != null){
					$.post("/bf4/loadout/save/", 
						{"loadout": JSON.stringify(assocIn(currentLoadout, ["selectedKit"], id))}, 
						function(){ 
							battleloginfo.stickyKit = id;
							battleloginfo.runKeepCurrentKit = true;
							window.setTimeout(battleloginfo.keepCurrentKit, 10000);
						});
		}
		else{
			if(battleloginfo.changeKitTrys < 10){
				battleloginfo.changeKitTrys++;
				window.setTimeout(battleloginfo.changeKit, 1000);
			}
		}
	}
}
battleloginfo.runKeepCurrentKit = false;
battleloginfo.keepCurrentKitRunning = false;
battleloginfo.keepCurrentKit = function(){
	if(battleloginfo.runKeepCurrentKit == true && battleloginfo.keepCurrentKitRunning == false && battleloginfo.stickyKit != null){
		this.keepCurrentKitRunning = true;
		var kit = battleloginfo.getCurrentLoadout();
		if(kit != null){				
			if(kit.selectedKit != battleloginfo.stickyKit){
				battleloginfo.changeKit(battleloginfo.stickyKit);
			}
		}		
		window.setTimeout(battleloginfo.keepCurrentKit, 10000);
	}
}

window.setTimeout(battleloginfo.changeKit, 1000);