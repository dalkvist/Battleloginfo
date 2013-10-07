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

var battleloginfo = {};

battleloginfo.changeKitTrys = 0;

battleloginfo.changeKit = function(id){
	if(id != null){
		if(loadout != null && loadout.getModel != null){
			var model = loadout.getModel();
			if(model.get != null){
				var currentLoadout = model.get("loadout");
				if(currentLoadout != null){
					$.post("/bf4/loadout/save/", 
						{"loadout": JSON.stringify(assocIn(currentLoadout, ["selectedKit"], id))}, 
						function(){ 
							battleloginfo.currentkit = id;
							window.setTimeout(battleloginfo.keepCurrentKit, 10000);
						});
				}
			}
		}
		else{
			if(battleloginfo.changeKitTrys < 10){
				battleloginfo.changeKitTrys++;
				window.setTimeout(battleloginfo.changeKit, 1000);
			}
		}
	}
}

battleloginfo.keepCurrentKitRunning = false;
battleloginfo.keepCurrentKit = function(){
	if(keepCurrentKitRunning == false && currentkit != null){
		if(loadout != null && loadout.getModel != null){
			var model = loadout.getModel();
			if(model.get != null){
				var currentLoadout = model.get("loadout");
				if(currentLoadout != null){
					if(currentLoadout.selectedKit != this.currentkit){
						this.changeKit(currentkit);
					}
				}
			}
		}
		this.keepCurrentKitRunning = true;
		window.setTimeout(battleloginfo.keepCurrentKit, 10000);
	}
}

window.setTimeout(battleloginfo.changeKit, 1000);