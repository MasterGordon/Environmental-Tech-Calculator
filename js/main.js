/**
 * 
 */
var allItemsArray = []
var allItems = {}
var requieredCount = []
var requieredItems = []
var frequieredCount = []
var frequieredItems = []
var newid = 0
var items = ""

var itemsRequest = new XMLHttpRequest();
itemsRequest.open('GET', 'resources/items.txt')
itemsRequest.onload = function() {
	var res = itemsRequest.responseText;
	items = res.split("\n")
	var loaded = 0
	for (var i = 0; i < items.length && !(items[i] in window); i++) {
		loadJSON(items[i])
	}

}
itemsRequest.send()

function loadHTML() {
	$("#menu li ul").empty()
	$("#k_other").empty()
	for (var i = 0; i < allItemsArray.length; i++) {
		if (!('disabled' in allItemsArray[i])) {
			// $("#itemtoadd").append("<option
			// value=\""+allItemsArray[i].id+"\">" + allItemsArray[i].name +
			// "</option>")
			if(typeof(allItemsArray[i].index) == 'undefined')
				console.error(allItemsArray[i])
			$("#k_" + allItemsArray[i].type).append(
					"<li data-position=\""+allItemsArray[i].index+"\"><div class=\"additem\" id=\"add" + allItemsArray[i].id
							+ "\">" + allItemsArray[i].name + "</div></li>")
		} else {
			// console.log(allItemsArray[i].name+" disabled. Not loading")
		}
	}

	$("#menu li ul").each(function() {
		$(this).html($(this).children('li').sort(function(a, b) {
			return ($(b).data('position')) < ($(a).data('position')) ? 1 : -1;
		}));
	});

	$(".additem")
			.click(
					function() {
						var id = parseInt($(this).attr("id").substring(3, 99))
						console.log(id)
						var tagid = 'item_' + id
						if ($('#' + tagid).length) {
							console.log(id + " allready exists!")
							return

						}
						$("#tocraft")
								.append(
										'<input id="'
												+ tagid
												+ '" name="value"><label id="lable_'
												+ tagid
												+ '" style="margin-top: 3px;" class="ui-widget" for="'
												+ tagid + '">  '
												+ getItemFromId(id).name
												+ '<br></label>')
						$("#" + tagid).spinner({
							min : 0,
							numberFormat : "n",
							change : function(event, ui) {
								if ($("#" + tagid).spinner("value") == 0) {
									$("#" + tagid).spinner("destroy")
									$("#" + tagid).remove()
									$("#lable_" + tagid).remove()
								}
							}
						});
						$("#" + tagid).val(1)
					})
}

function loadJSON(itemname) {
	var itemRequest = new XMLHttpRequest();
	itemRequest.open('GET', 'resources/items/' + itemname + '.txt')
	console.log("Loading: " + itemname + ".txt")
	itemRequest.onload = function() {
		itemname = itemname.replace(/\s/g, "")
		var item = JSON.parse(itemRequest.responseText)
		if (!('name' in item)) {
			item.name = itemname
			console.warn("missing key \"name\" in " + itemname)
		}
		item.id = newid
		allItems[itemname] = item
		allItemsArray.push(item)
		console.log(item)
		loadHTML()
		newid++
		if (newid == items.length){
			$("#menu").menu("refresh");
			
		}
	}
	itemRequest.send()
}

function getItemFromId(index) {
	for (var i = 0; i < allItemsArray.length; i++) {
		if (allItemsArray[i].id == index)
			return allItemsArray[i]
	}
	return null
}

$(document)
		.ready(
				function() {
					// SEITE HAT GELADEN

					$("#itemtoadd").selectmenu()
					$("#additem").button()
					$("#calc").button()

					// BUTTONS
					$(".additem")
							.click(
									function() {
										var id = $("#itemtoadd").val()
										console.log("Adding " + id + "...")
										var tagid = 'item_' + id
										if ($('#' + tagid).length) {
											console.log(id
													+ " allready exists!")
											return

										}
										$("#tocraft")
												.append(
														'<input id="'
																+ tagid
																+ '" name="value"><label id="lable_'
																+ tagid
																+ '" style="margin-top: 3px;" class="ui-widget" for="'
																+ tagid
																+ '">  '
																+ getItemFromId(id).name
																+ '<br></label>')
										$("#" + tagid)
												.spinner(
														{
															min : 0,
															numberFormat : "n",
															change : function(
																	event, ui) {
																if ($(
																		"#"
																				+ tagid)
																		.spinner(
																				"value") == 0) {
																	$(
																			"#"
																					+ tagid)
																			.spinner(
																					"destroy")
																	$(
																			"#"
																					+ tagid)
																			.remove()
																	$(
																			"#lable_"
																					+ tagid)
																			.remove()
																}
															}
														});
										$("#" + tagid).val(1)
									})

					$("#calc")
							.click(
									function() {
										requieredCount = []
										requieredItems = []
										for (var i = 0; i < newid; i++) {
											var tag = "#item_" + i;
											if ($(tag).length) {
												var item = allItemsArray[i]
												var count = 1
												if (item.count)
													var count = item.count
												for (var n = 0; n < Math
														.ceil($(tag).spinner(
																"value")
																/ count); n++) {
													for (var j = 0; j < item.crafting.length; j++) {
														if (requieredItems
																.indexOf(item.crafting[j]) == -1) {
															requieredCount[requieredItems.length] = 1
															requieredItems[requieredItems.length] = item.crafting[j]
															console.log("-1")
														} else {
															requieredCount[requieredItems
																	.indexOf(item.crafting[j])] += 1
														}
													}
												}

											}
										}
										makeCrafting()
										updateoutput()
									})

				})

function makeCrafting() {
	frequieredCount = requieredCount.slice()
	frequieredItems = requieredItems.slice()
	var swapped = false
	do {
		swapped = false
		var k = 0;
		while (k < frequieredItems.length) {
			var itemid = frequieredItems[k]
			if (allItems[itemid]) {
				swapped = true
				console.log("SWAPPED")
				var item = allItems[itemid]
				var count = 1
				var itemcount = frequieredCount[k]
				if (item.count)
					var count = item.count
				frequieredCount.splice(k, 1)
				frequieredItems.splice(k, 1)
				for (var i = 0; i < Math.ceil(itemcount / count); i++) {
					for (var j = 0; j < item.crafting.length; j++) {
						if (frequieredItems.indexOf(item.crafting[j]) == -1) {
							frequieredCount[frequieredItems.length] = 1
							frequieredItems[frequieredItems.length] = item.crafting[j]
						} else {
							frequieredCount[frequieredItems
									.indexOf(item.crafting[j])] += 1
						}
					}
				}
			}
			k++
		}
	} while (swapped)
	console.log(frequieredItems)
}

function updateoutput() {
	$("#output").empty()
	$("#outputfull").empty()
	$("#outputfull").append('<h1 class="ui-widget">=</h1>')
	for (var i = 0; i < requieredItems.length; i++) {
		if (allItems[requieredItems[i]]) {
			$("#output").append(
					"<span id=\"" + i
							+ "\" class=\"ui-widget outputitem splitable\">"
							+ requieredCount[i] + "x "
							+ allItems[requieredItems[i]].name + "</span><br>")
		} else {
			$("#output").append(
					"<span id=\"" + i
							+ "\" class=\"ui-widget outputitem notsplitable\">"
							+ requieredCount[i] + "x " + requieredItems[i]
							+ "</span><br>")
		}
	}
	
	for (var i = 0; i < frequieredItems.length; i++) {
		if (allItems[frequieredItems[i]]) {
			$("#outputfull").append(
					"<span id=\"" + i
							+ "\" class=\"ui-widget notsplitable\">"
							+ frequieredCount[i] + "x "
							+ allItems[requieredItems[i]].name + "</span><br>")
		} else {
			$("#outputfull").append(
					"<span id=\"" + i
							+ "\" class=\"ui-widget notsplitable\">"
							+ frequieredCount[i] + "x " + frequieredItems[i]
							+ "</span><br>")
		}
	}

	$(".outputitem")
			.click(
					function() {
						console.log($(this).attr('id'))
						var index = parseInt($(this).attr('id'))
						var itemid = requieredItems[index]
						var itemcount = requieredCount[index]
						if (allItems[itemid]) {
							var item = allItems[itemid]
							var count = 1
							if (item.count)
								var count = item.count
							requieredCount.splice(index, 1)
							requieredItems.splice(index, 1)
							for (var i = 0; i < Math.ceil(itemcount / count); i++) {
								for (var j = 0; j < item.crafting.length; j++) {

									if (requieredItems
											.indexOf(item.crafting[j]) == -1) {
										requieredCount[requieredItems.length] = 1
										requieredItems[requieredItems.length] = item.crafting[j]
										console.log("-1")
									} else {
										requieredCount[requieredItems
												.indexOf(item.crafting[j])] += 1
									}
								}
							}
							$('#' + index).fadeOut(300)
							setTimeout(function() {
								updateoutput()
							}, 300)
						}
					})
}