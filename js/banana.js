var e = {};

const dateStamp = function() {
	const d = new Date();
	return [
		String(d.getFullYear()).slice(-2),
		String(d.getMonth() + 1).padStart(2,'0'),
		String(d.getDate()).padStart(2,'0'),
		String(d.getHours()).padStart(2,'0'),
		String(d.getMinutes()).padStart(2,'0'),
		String(d.getSeconds()).padStart(2,'0')
	].join('-');
}

const getRandomString = function(length = 8, weird = .2, spaced) {
	var type = Math.round(Math.random());
	var index = 0;
	var output = "";
	const letters = [
		["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","y","z"],
		["a","e","i","o","u"]
	];
	while (index < length) {
		output = output + letters[type][Math.floor(Math.random() * letters[type].length)];
		if (Math.random() > weird) type ^= 1;
		index++;
		if (spaced && index < length && Math.random() < weird) output = output + " ";
	}
	return output;
}

function getRandomInt(min, max) {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

const titleCase = function(t) {
	return t.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
		return match.toUpperCase();
	});
}

const populate = function (action) {
	if (action == 'download') {
		const d = new Date();
		e.download = document.createElement('a');
		e.download.href = e.canvas.toDataURL("image/png;base64");
		e.download.download = `TPList@${dateStamp()}`;
		return e.download.click();
	}
	var names = "";
	var breakpoints = [0, 0, 0, 0];
	var total = 0;
	var err = [];
	var sortedTiers = [];
	var tierOptions = [];
	if (action == 'sample') {
		for (i = 0; i < e.tiers.length; i++) {
			var limit = getRandomInt(128,196);
			var samples = [];
			for (n = 0; n < limit; n++) samples.push(titleCase(getRandomString(getRandomInt(3,16), 0.2, true)));
			e.tiers[i].value = samples.join(', ');
		}
	}
	else if (action == 'reset') {
		for (i = 0; i < e.tiers.length; i++) {
			e.tiers[i].value = '';
		}
	}
	for (i = 0; i < e.tiers.length; i++) {
		if (document.getElementById("sort" + (i + 1)).checked) {
			sortedTiers[i] = e.tiers[i].value.split(",").sort((a, b) => a.trim().localeCompare(b.trim())).join(",").trim();
		}
		else {
			sortedTiers[i] = e.tiers[i].value;
		}
		if (names == "") {
			names = sortedTiers[i];
			total = total + sortedTiers[i].split(",").length;
		}
		else if (sortedTiers[i] != "") {
			names = names + "," + sortedTiers[i];
			total = total + sortedTiers[i].split(",").length;
		}
		tierOptions[i] = {
			fixCase: document.getElementById("fixcase" + (i + 1)).checked,
			numbered: document.getElementById("numbered" + (i + 1)).checked
		}
		breakpoints[i] = total;
	}
	e.canvas.width = 1920 * 2;
	e.canvas.height = 1080 * 2;
	var ctx = e.canvas.getContext('2d');
	ctx.drawImage(e.source, 0, 0);
	var list = names.split(",");
	var fontHeight = e.font.nameSize;
	var lineHeight = fontHeight + 2;
	var limit = Math.floor(1820 / lineHeight);
	var totalColumns = Math.ceil(list.length / (limit + 1));
	var columnWidth = Math.ceil(3720 / totalColumns);
	var line = 0;
	var column = 0;
	var rank = 0;
	var color = ["#f2e224", "#d0d2f4", "#c0c242", "#b2b4b6"]
	for (i = 0; i < list.length; i++) {
		if (list.length < 2) break;
		var name = list[i].trim();
		if (name.length < 1) {
			err.push(`⚠️ Empty name @ position #${i + 1} (tier ${rank + 1})`);
			name = ' ';
		}
		if (tierOptions[rank].fixCase) name = titleCase(name);
		var x = columnWidth / 4 + (column * columnWidth);
		var y = 260 + (line * lineHeight)
		if (name != ' ') {
			ctx.drawImage(e.tier[rank], x - 6, y - fontHeight + (rank == 0 ? 6 : 8), 40, 40);
			ctx.font = `${e.font.numSize}px ${e.font.num}`;
			ctx.fillStyle = "#112233bb";
			ctx.textAlign = "center";
			if (tierOptions[rank].numbered) ctx.fillText(i + 1, x + 14, y-2);
		}
		ctx.fillStyle = color[rank];
		ctx.textAlign = "left";
		ctx.font = `${fontHeight}px ${e.font.name}`;
		ctx.fillStyle = "#112233";
		ctx.fillText(name, x + 40, y + 8, (columnWidth - fontHeight * 1.5));
		ctx.fillStyle = color[rank];
		ctx.fillText(name, x + 40, y + 4, (columnWidth - fontHeight * 1.5));

		line++;
		if (line > limit) {
			column++;
			line = 0;
		}
		while (i == (breakpoints[rank] - 1)) rank++;
	}
	if (err.length > 0) {
		e.debug.innerHTML = err.join('<br>');
		e.debug.classList.add('error');
	}
	else {
		e.debug.innerHTML = "";
		e.debug.classList.remove('error');
	}
	return false;
}

document.addEventListener('DOMContentLoaded', function () {

	e = {
		font: {
			name: `Teko, sans-serif`,
			num: `'Barlow Condensed', sans-serif`,
			nameSize: 36,
			numSize: 18
		},
		source: document.getElementById('source'),
		debug: document.getElementById('debug'),
		tiers: document.getElementsByClassName('tier'),
		tier: [document.getElementById('tier1'), document.getElementById('tier2'), document.getElementById('tier3'), document.getElementById('tier4')],
		canvas: document.getElementById('canvas')
	}

	e.source.onload = populate;
	e.canvas.onclick = populate;

});
