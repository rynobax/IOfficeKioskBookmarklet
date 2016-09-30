javascript:(function(){
	/* Ryan Baxley 2016 */
	if (window.hasOwnProperty('ryanDetectPropertyForOnlyOneInstance_dsljl236t5sd326ag')) {
		alert('"No Location" has already been loaded.');
    }else{
        window.ryanDetectPropertyForOnlyOneInstance_dsljl236t5sd326ag = true;

		alert('"No Location" remover loaded.');

		/* Stuff I took from StackOverflow */

		var observeDOM = (function(){
		    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
		        eventListenerSupported = window.addEventListener;

		    return function(obj, callback){
		        if( MutationObserver ){
		            /* define a new observer */
		            var obs = new MutationObserver(function(mutations, observer){
		                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
		                    callback();
		            });
		            /* have the observer observe foo for changes in children */
		            obs.observe( obj, { childList:true, subtree:true });
		        }
		        else if( eventListenerSupported ){
		            obj.addEventListener("DOMNodeInserted", callback, false);
		            obj.addEventListener("DOMNodeRemoved", callback, false);
		        }
		    }
		}) ();

		/* Stuff I wrote */

		/* Gathering Data Code */
		function getRawTableData(){
			/* Scrapes old table for data and throws it in an array */
			var table = document.getElementById("queueItemsTBody");
			rows = table.getElementsByTagName("tr");
			var data = {};
			for (var ri = 0; ri < rows.length; ri++) {
				var rowdata = {};
				columns = rows[ri].getElementsByTagName("td");
				var ci;
				for(ci = 0; ci < columns.length; ci++){
					rowdata[ci] = columns[ci].innerHTML;
				}
				rowdata[ci+1] = rows[ri].id;
				rowdata[ci+2] = rows[ri].className;
				data[ri] = rowdata;
			}
			return data;
		}

		function convertRawToProcessed(data){
			/* Pulls data from array made by getRawTableData and *
			 * puts it in a more logical data structure 	     */
			var newDataArray = {};
			for(var ri=0; ri<Object.keys(data).length; ri++){
				row = data[ri];
				var newData = {};
				newData["name"] = row[0];
				if(row[0] == "No Packages at this Time"){
 					return "No Packages";
 				}
				
				newData["boxno"] = row[1];
				
				var items = row[2].split("<br>");
				var itemTypes = {};
				for (var itemi = 0; itemi < items.length; itemi++){
					var temp = items[itemi].split(",");
					var itemType = temp[0].split(" ").splice(-1);

					var lastIndex = temp[0].lastIndexOf(" ");
					var courier = temp[0].substring(0, lastIndex);

					var fromText = '';
					if(temp[1] != undefined){
						fromText = temp[1];
					}


					if(itemTypes[itemType] == undefined){
						itemTypes[itemType] = {};
						itemTypes[itemType].count = 1;
					}else{
						itemTypes[itemType].count += 1;
					}
					
					if(fromText != ""){
						if(itemTypes[itemType].fromTextArray == undefined) itemTypes[itemType].fromTextArray = {};
						if(itemTypes[itemType].fromTextArray[fromText] == undefined){
							itemTypes[itemType].fromTextArray[fromText] = 1;
							if(itemTypes[itemType].commaCount == undefined){
								itemTypes[itemType].commaCount = 0;
							}else{
								itemTypes[itemType].commaCount += 1;
							}
						}else{
							itemTypes[itemType].fromTextArray[fromText] += 1;
							itemTypes[itemType].commaCount += 1;
						}
					}				
				}
				newData["types"] = itemTypes;

				newData["location"] = row[3];

				newData["time"] = row[4];

				newData["id"] = row[7];

				if(row[8].includes("selected")){
					newData["selected"] = true;
				}else{
					newData["selected"] = false;
				}

				newDataArray[ri] = newData;
			}
			return newDataArray;
		}

		/* New Table Code */
		function populateTable(data){
			/* Populates the new table with data from old table */
			var table = document.getElementById("newTable");
	 		table.innerHTML = "";
 			var length = table.rows.length;
			if(data == "No Packages"){
 				var row = table.insertRow(0);
 				var cell = row.insertCell(0);
 				cell.innerHTML = "No Packages at this Time";
 				return table.outerHTML;
 			}
			for(var i=0; i<Object.keys(data).length; i++){
				var name = data[i]["name"];
				var boxno = data[i]["boxno"];
				var types = data[i]["types"];
				var location = data[i]["location"];
				var time = data[i]["time"];
				var id = data[i]["id"];
				var selected = data[i]["selected"];
				
				var row = table.insertRow(i);
				row.id = "new" + id;
				if(selected){
					row.className = "selected";
				}else{
					row.className = "";
				}

				var namewidth = "30%";
				var useridwidth = "20%";
				var packagewidth = "30%";
				var timewidth = "20%";

				var nameCell = row.insertCell(0);
				/*nameCell.innerHTML = name.slice(0, name.indexOf(',')+1) + '<br>' + name.slice(name.indexOf(',')+1); */
				nameCell.innerHTML = name;
				nameCell.width = namewidth;

				var useridCell = row.insertCell(1);
				useridCell.innerHTML = boxno;
				useridCell.width = useridwidth;
				
				var packageText = "";
				var locationText = "";

				var ignoreFirst = 0;
				for(type in types){
					if(ignoreFirst++ >= 1) packageText+='<br>';
					packageText += type + ': ' + types[type].count;
					if(types[type].fromTextArray != undefined){
						packageText += ' (';
						var commaCount = types[type].commaCount;
						for(fromText in types[type].fromTextArray){
							for(var j=0; j<types[type].fromTextArray[fromText]; j++){
								packageText += fromText;
								if(commaCount>0){
									packageText += ', ';
								}
								commaCount--;
							}
						}
						packageText += ')';
					}
				}

				var packageCell = row.insertCell(2);
				packageCell.innerHTML = packageText;
				packageCell.width = packagewidth;

				var timeCell = row.insertCell(3);
				time = time.slice(time.indexOf(':')-2,time.length);
				timeCell.innerHTML = time;
				timeCell.width = timewidth;
			}
		}
		
		function addStatistics(data){
			var table = document.getElementById("statsTable");
	 		table.innerHTML = "";
			if(data == "No Packages"){
 				var row = table.insertRow(0);
 				var timeCell = row.insertCell(0);
 				timeCell.innerHTML = "0 Min Wait Time";
 				var countCell = row.insertCell(1);
 				countCell.innerHTML = "0 Students Waiting in Queue";
 				return table.outerHTML;
 			}
 			var studentCount = Object.keys(data).length;
 			var row = table.insertRow(0);
 			
			var time = data[0]["time"];
			var digitalTime = time.substring(time.indexOf(':') - 2, time.indexOf(':') + 3);
			var oldestHour = parseInt(digitalTime.substring(0, 2));
			if(oldestHour < 6) oldestHour += 12;
			var oldestMinute = parseInt(digitalTime.substring(3, 5));
			var now = new Date();
			var nowHour = now.getHours();
			var nowMinute = now.getMinutes();
			var hourDifference = 60 * (nowHour - oldestHour);
			var minDifference = nowMinute - oldestMinute;
			var waitTime = hourDifference + minDifference;
			
			console.log("now hour: "+ nowHour);
			console.log("now min: "+ nowMinute);
			console.log("oldest hour: "+ oldestHour);
			console.log("oldest min: "+ oldestMinute);
 			
 			var timeCell = row.insertCell(0);
 			timeCell.innerHTML = waitTime + " min Wait Time";
 			
 			var countCell = row.insertCell(1);
 			countCell.innerHTML = studentCount + " Students Waiting in Queue";
		}

		function addEventHandlers(){
			/* Adds touch events to the new table */
			var table = document.getElementById("newTable");
			var rows = table.rows;
			for(var ri = 0; ri < rows.length; ri++){
				row = rows[ri];
				row.addEventListener('click', function() {
					if(this.innerHTML.includes("No Packages at this Time")){
						return;
					}
					var id = this.id.substr(6,row.id.length);
					if(this.className.includes("selected")){
						this.className = "";
					}else{
						this.className = "selected";
					}
					clickItem(id);
				});
			}
		}

		function getStyleText(){
			/* Style for the new table */
			var styleText = "" +
				"<style>" +
				"	table {" +
				"	  border-collapse: collapse;" +
				"	  background-color:white;" +
				"	}" +
				"	tr { " +
				"	  border: solid;" +
				"	  border-width: 2px 0;" +
				"	}" +
				"</style>";
			return styleText;
		}
		
		function buildTableFramework(){
			/* Adds barebones of new table so it can be populated */
			
			var table = document.createElement("TABLE");
			table.id = "newTable";
			table.width = "100%";
			table.backgroundColor = "white";
			
			var formToAppendTo = document.getElementById("wrapper");
			formToAppendTo.outerHTML += getStyleText() + table.outerHTML;
		}
		
		function buildStatisticsFramework(){
			var statisticsTable = document.createElement("TABLE");
			statisticsTable.id = "statsTable";
			statisticsTable.width = "100%";
			statisticsTable.backgroundColor = "white";
			
			var newTable = document.getElementById("newTable");
			newTable.outerHTML = statisticsTable.outerHTML + newTable.outerHTML;
		}

		function buildNewTable(){
			/* Run everything needed to populate the table */
			var raw = getRawTableData();
			var data = convertRawToProcessed(raw);
			populateTable(data);
			addEventHandlers();
		}
		
		function buildNewTableWithStats(){
			/* Run everything needed to populate the table */
			var raw = getRawTableData();
			var data = convertRawToProcessed(raw);
			populateTable(data);
			addStatistics(data);
		}

		function removeOldTable(){
			/* Hides the old table */
			var queueItems = document.getElementById("queueItems");
			queueItems.style.display = "none";
			
			var wrapper = document.getElementById("wrapper");
			wrapper.style.height = "0px";
		}
		       

		/* Observation code */
		function enableObservation(){
			observeDOM( document.getElementById("queueItemsTBody") ,function(){
				if(!runningTableChange)	tableChangeCallback();
			});
		}

		/* MutationObserver fires more and more the longer *
		 * it is running so this variable prevents it from *
		 * repeatedly calling tableChangeCallback 	   */
		var runningTableChange = false;
		function tableChangeCallback(){
			runningTableChange = true;
			if(frontMode == 0){
				buildNewTable();
			}else if(frontMode == 1){
				buildNewTableWithStats();
			}
			runningTableChange = false;
		}

		/* Run the cleanup initially */
		var frontMode = 0;
		removeOldTable();
		buildTableFramework();
		if(frontMode == 1){
			buildStatisticsFramework();
		}
		tableChangeCallback();
		enableObservation();
    }
}) ();
