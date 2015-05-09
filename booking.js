function TrainCheck(){
	var signalId=0, pauseId, sound = true, neededNumber = "106";
	this.firstWagon = 3;
	this.lastWagon = 14;
	this.allPlaces = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
	this.lowerPlaces = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
	this.userPlaces = this.allPlaces;
	var	_this = this;
	this.start = function(interval, trainNumber){
		if (trainNumber) {neededNumber = trainNumber};
		pauseId = setInterval(searchAndCheck, interval);
	}
	this.stop = function(){
		clearInterval(pauseId);
		clearInterval(signalId);
	}
	this.mute = function(){
		sound = false;
		clearInterval(signalId);
		console.log("stopping " + signalId);
	}
	this.alarm = function(){
		sound = true;
	}
	checkTrainNumber = function(t){
		return t.num.indexOf(neededNumber)>=0;
	}
	hasNicePlace = function(vagon){
		for(var i =0; i<_this.userPlaces.length; i++){
			if(vagon.hasPlace(_this.userPlaces[i])){
				return true;
			}
		}
		return false;
	}
	processVagons = function(train){
		var signalCount=0;
		console.log(train.coaches);
		for(var i=0;i<train.coaches.length;i++){
			var vagon=train.coaches[i];
			//skip head/tail wagons
			if(vagon.num >=_this.firstWagon && vagon.num<=_this.lastWagon){
				console.log("vagon range ok");
				if(hasNicePlace(vagon) && sound){
					signalId>0 && clearInterval(signalId);
					signalId=setInterval(function(){
						var audio = new Audio('http://www.freesound.org/data/previews/213/213671_1979597-lq.mp3');
						audio.play();
						++signalCount >=5 && clearInterval(signalId);
					}, 8000);
					console.log(signalId+ " has been started");
				}
				break;
			}
		}
	}
	searchAndCheck = function(){
		console.log(">>> check at: " + new Date());
		var signalCount=0;
		//global object, defined in PurchaseModule. Reset it every invocation.
        trains = new TTrains();

		Common.ajax(GV.page.module + '/search/', { form: frmSearch._form }, function (resp) {
			if (resp.error) {
				if (!Helper.limitError(resp, frmSearch._onSubmit))
					trains.error(resp.value);
			} else {
				//parse internal objects, fill the trains. Show trains on the page.
				trains.show(resp.value);
				for( var i=0; i<trains._list.length; i++){
					var ttrain=trains._list[i];
					if(checkTrainNumber(ttrain)){
						//iterate over vagon types
						for(var vt=0;vt<ttrain.types.length;vt++){
							//we need 'K'-kupe type. Timeout 5sec to wait for callback.
							var ttype = ttrain.types[vt];
							if(ttype.letter === "К"){
								trains._onWagonTypeClick(ttype,ttrain);
								setTimeout(function() {
									processVagons(ttrain); }, 2000);
							}
						}

					}
				}
			}
		});
	}
};
var tc = new TrainCheck();
tc.userPlaces=tc.lowerPlaces;
tc.start(10000, "106");