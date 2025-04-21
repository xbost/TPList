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
	var sortedTiers = [];
	var tierOptions = [];
	if (action == 'sample') {
		for (i = 0; i < e.tiers.length; i++) {
			e.tiers[i].value = e.sample[i];
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
	e.canvas.width = 1920;
	e.canvas.height = 1080;
	var ctx = e.canvas.getContext('2d');
	ctx.drawImage(e.source, 0, 0);
	var list = names.split(",");
	var fontHeight = e.font.nameSize;
	var lineHeight = fontHeight + 2;
	var limit = Math.floor(910 / lineHeight);
	var totalColumns = Math.ceil(list.length / (limit + 1));
	var columnWidth = Math.ceil(1860 / totalColumns);
	var line = 0;
	var column = 0;
	var rank = 0;
	var color = ["#f2e224", "#d0d2f4", "#c0c242", "#b2b4b6"]
	for (i = 0; i < list.length; i++) {
		if (list.length < 2) break;
		var x = columnWidth / 4 + (column * columnWidth);
		var y = 130 + (line * lineHeight)
		ctx.drawImage(e.tier[rank], x - 3, y - fontHeight + (rank == 0 ? 3 : 4), 20, 20);
		ctx.font = `${e.font.numSize}px ${e.font.num}`;
		ctx.fillStyle = "#112233bb";
		ctx.textAlign = "center";
		if (tierOptions[rank].numbered) ctx.fillText(i + 1, x + 7, y);
		ctx.fillStyle = color[rank];
		ctx.textAlign = "left";
		ctx.font = `${fontHeight}px ${e.font.name}`;
		var name = list[i].trim();
		if (name.length < 1) {
			alert("⚠️ Empty name at #" + (i + 1) + ", check your lists for extra commas");
			name = '?';
		}
		if (tierOptions[rank].fixCase) name = titleCase(name);
		ctx.fillStyle = "#112233";
		ctx.fillText(name, x + 20, y + 4, (columnWidth - fontHeight * 1.5));
		ctx.fillStyle = color[rank];
		ctx.fillText(name, x + 20, y + 2, (columnWidth - fontHeight * 1.5));

		line++;
		if (line > limit) {
			column++;
			line = 0;
		}
		while (i == (breakpoints[rank] - 1)) rank++;
	}
	return false;
}

document.addEventListener('DOMContentLoaded', function () {

	e = {
		font: {
			name: `Teko, sans-serif`,
			num: `'Barlow Condensed', sans-serif`,
			nameSize: 18,
			numSize: 10
		},
		source: document.getElementById('source'),
		tiers: document.getElementsByClassName('tier'),
		tier: [document.getElementById('tier1'), document.getElementById('tier2'), document.getElementById('tier3'), document.getElementById('tier4')],
		canvas: document.getElementById('canvas'),
		sample: [
			"SxxpVxVx, Kylx Vxsquxz, Kxtxx n Kxxth, Xbost, Juggxr Nuggs, Dxvxd Jxmxs Kxlly, Gxrxfxxnd, Urmxnshxrx, Rxymxnd Gxrrxck Gxmxz, xvxn xnfxngxr, Blxckhxll, MxrgxsmThxPxWxRFUL, xttxpupu, xrxc Sxlvxrwxlf, Jxrgx Gxxvxnnx Vxnxgxs, xnthxny Pxrxz",
			"PxulF, Chrxs Chxnt, Cxrlx Mxrxttx, Jxmxxxx, Txxxk, Hxrmxnxc Chxxs, Kxckbxxxng Bxnxnx, Mxrcxllus xvxrxttx, xdxm Pxrkxr, Squxrxdxwxyxxx, Dxllxs Smxth, Cxhxsxvx Chxn, Wxll, xnthxny McNulty, Pxdzxn, Mxkx Vxnn, Cxssxll, Mxgx Wlxd, Pxrkbxnx, Thxprxfxssxrxxx, Rxvxn, Cxsxy Smxth, xrgblxgc, Gxmxplxyxrxxxx, Grxxk Gxddxss, xblutxphxbxc, Rxwxn Nxghtfxll, Justxn Kxsuk, xdxm McKnxght, UnknxwnBxlmxnt, ThxNxxbxbxdxs, Urbxn Shxdxws, Mxxfx, xdrxxn X DuPlxssxs, Bxlgxrxn, Txm Vxngsxs, MxntusTxbxggxnxx, Frxdxns, Pxul Jxnzxn, Bxb Pxlxt, Kxgx Nx Shukun, Jtyxx, xlxx Dxnxxls, Rxxcx luttxrlxch, JxnnyBxy, xhrxmxn_xxxlx, Cxrpxrxtx, Thxt SLxV Dudx, x-Vxry-Lxxxng-Nxmx, x-Vxry-Vxry-Lxxxng-Nxmx, x-Vxry-Vxry-Vxry-Lxxxng-Nxmx",
			"Mxtch Grxy, Jxxvrxgx, Dbxxdxxxxx, Kxxlxrx, xhmxd Jxbxr, xxxrtxr, Tylxr Dxdgx, Kylx Murrxy, Jxn Thxxl Jxxrgxnsxn, Drxgxr, BxxrBxnxz,  Dxrrxn Pxynx, DxrHxxxnhxmmxr, Chrxs xpplxtt, Thx Dudx, Lxppys, Mxkx Rxbb, Mxrk Fxxrxttx, ChxxsxcxkxYxxh, Txrrtxn(Drxkx), MrMcGxbblxtsxxx, Dxnxxl Brxxks, Sxxn Wxlsxn, xljx xdxlmxnn, xrthur Cyrus, Pxrxgxn xf Hxpx, NxStxlgxK, ThxDxrthSxdx, Jxck Slxytxr, Ryxn Wxbbxr, Sxm Thxmxs, Dxdgxmus Prxmx, Mcxxlguyx, xbxyMx, Sxmuxl Hxrt, RxDnFUZZY, Jx? Rxbxxrx, Trxntxsxurus Rxx, xrxxchx, Jxm Vxlx, Kxng Zxckxndxrff, Rxngx Txxnux, Scxt M, Cxmxrxn Fxrth, DxspxxrNLD, xcxlxt xvx, Shxlly & Mxchxxl, Lxurxnt Jxuffrxt, Whxtx Wxlf, DxxthKxssMyFxcx, FrxnkxxJrxx, ThxCxrmxn, _txurnxquxt, Twxxklxc, Trxstxn Whxtx, Mxurxcxxxxx, LxsT_Scxvxngxr, Thx Kxrdxnxl, Mxxxmx,Rllmsyhr, Gpxnxx, Blxckbxrd, xndy N, Squxnky, Fxbxxn Sxngh, Chxzxn, Sxnxgx Nxtxshx, Mxctxgbxx, SynxstxrSyd, Stxgxr, FxrxlRxnchu, Kxxrxn Thurlxw, Dxnnxz Kxxmxl, xxgxsxsurvxvxr, Jxxl Bxyxr, Mxx Dxvlxn, Brxxks Wxlsxn, Txmmymxllxy, DxwnByFxvx, Rxxmxz, Mxtt Clxrkx, Smxkx&Mxrrxrs, PxulF, Chrxs Chxnt, Cxrlx Mxrxttx, Jxmxxxx, Txxxk, Hxrmxnxc Chxxs, Kxckbxxxng Bxnxnx, Mxrcxllus xvxrxttx, xdxm Pxrkxr, Squxrxdxwxyxxx, Dxllxs Smxth, Cxhxsxvx Chxn, Wxll, xnthxny McNulty, Pxdzxn, Mxkx Vxnn, Cxssxll, Mxgx Wlxd, Pxrkbxnx, Thxprxfxssxrxxx, Rxvxn, Cxsxy Smxth, xrgblxgc, Gxmxplxyxrxxxx, Grxxk Gxddxss, xblutxphxbxc, Rxwxn Nxghtfxll, Justxn Kxsuk, xdxm McKnxght, UnknxwnBxlmxnt, ThxNxxbxbxdxs, Urbxn Shxdxws, Mxxfx, xdrxxn X DuPlxssxs, Bxlgxrxn, Txm Vxngsxs, MxntusTxbxggxnxx, Frxdxns, Pxul Jxnzxn, Bxb Pxlxt, Kxgx Nx Shukun, Jtyxx, xlxx Dxnxxls, Rxxcx luttxrlxch, JxnnyBxy, xhrxmxn_xxxlx, Cxrpxrxtx, Thxt SLxV Dudx",
			"Jxkx Russxll, Zxc Wxlsh, Hxrxxxxx, Scxtt, Txm Cumxns, Hulydxxly, Phxlxp Dxvxy, xrvxngShxtsmxn, Jxxn xhn, Nxthxn Zxgrxxn, Grxxbx, Thxxdxsxs, xnthxny DxNxvx, Lucxs Grxxnx, Dxvxd Dxnnxxn, HxkxxGxmxr, Chxd Grxvxr, Jxrry Sxmmxns, xhmxd, Txxm HumYxxh, Kxdscxllmxhxju, Wxssxm x, ThxxlmxghtySquxrrxl, ZxCks, xnthxny Mxtchxll, Bxumbusch, ClxssxcZxch, Bxg Bxn, MrTurnbxlt, Lxnk, Grxzz, Txnnxr Flxhxrty, Xxvxrxnx, xJx, Bxgxlxx, Pxtrxck x'brxxn, Jxrxmy Mxrrxn, Zxng Dxng, Chxrs Kumxsxkx, SxnxfKrxx, Jxmxs Txrdxmxn, Bj?rn Grunwxld, Cxssxdy, Jxsxn Fxndxrsxn, xshxxx, JxdBullxt, xngxl, SkxnxndMxrrxw, BxxrBxgs, Pxrxgxn Bxlk, xnrxqux Lxx Dxxz, Mxrk Vxckxrs, Jxmxs Fxx, Jxmxx Smxth, PS Gunkxx, Stxvxn Cxlxntuxnx, DxrGxbx, Bxn Rxplxy, Mxrdxcxx, Xxvxxr Mxrtxnxz, Chrxs, Zxrxmus, xrxn Rxbxrts, Lxxm xbrxxn, Mxthxxs xlxxxndxr, Vxctxr McDxwxll, Nxvxrxxn, Txshkx-mxnxkx, Funnymxtt, Mxttxcus, MxxX, Jxxmxl, Cxnxr Quxncxy, Jxn Snxw, RJxmxnxzxx, Lxx, Xzhxu, DxrkMxrcusxxxx, Sxmxguy, Jxzz Hxnds, Kxlx, SxxNxrrxs, xlxx B, Mxgxvxltxx, ScxHxrx, xlxx Mxnrxss, ThxLxxfxrMxn, Snxkxwxzxrd, Whxtxvxnxm, Utxrus Mxxxmus, KxxjuJxhnny, RxD WxLF xx, Rxck Kxrpxrshxxk, Gxtxdxm, Kxssxus, Stxckyxx, Rxgnxrxx, ZxSTxNx, Thxmxs Jxnxs, xgxnnnxxxx, xnyx RTx, Bluxxpplxs, ThxJxckxl, Thx Lxughxng Mxn, Mxttydrxxd, Lukx Frxggxtt, Chrxstxphxr Hxrrxw, Wxll Jxnxs, xvxr Bxggun, Jxff xzurx, Lxmbx, Wxylxn, Wxrlxrd, ThxMxxrdx, Undxrhxll, Gxrxlt_xf_Rxvxx, Sxxn Kxng, DxrkxngxlRxfxxl, xxxBxg, Mxstxr Spxrk, Chrxnxbunny, Dxrklxnkxx, Lunchmxxtxxxx, Mxtt Bxrgmxn, Cxttxvx, Mxtt Cxrry, Mxrtxjn Grxxt, Yxungstxxx, Hypxrdxxthxx, Bxg Dxddy Swxxth, Rxquxnnx, Dxvxdgxln, Stxvxx Wxnwxxd, Jxmxx Wxldx, DxrylKxl-xl, Hxmxn Kxrn, xslxt xf Lxngxrhxns, Cxrlx Guxdxttx, Mxkx Nxlsxn, xlxx Sxxckmxnn, xpplxjxcksxxxx, Sxr Nx, Grubmxn, Sxnbxdxx, Kxvxn Kxmmxl, xldrxd_sx, Thxn, Bxllywxngxlxxd, HyxsungxRD, Sxmxn D. Mxgus, Mxlxx, Txyyyyyyy, Spxnxnx, ThxDxrkTxwxr, Rxlxy Mxrrxs, xngxl xyxs, Wxlsxscx, MxnuxlF, Drxw, Knxght xrchxx, Wxtxrxngcxnx, xCxRxrxn, Hxxvyxrmx, Hxppxusxmxgx, Wrxthxxxx, Jxff Rxss, RxxKz, Uhxh Jxmxrxx, BrxndxnC, xShxdxwxps, Cxlvxy, Kxxrxnxxxx, xlxspxxrjxrdxn, Cxlxssxxd, Dxxtsunxchxjxn, Txrdzxr, Chxstycxt, KxN BxGxxT, Mxtt Rxxd, Dxvxd Trxss, xlxx.P, Pxpx_Gxscxxgnx, xxzyMxchxxl, Ultxmxtx K, xLynchy, CJ, ThxPursuxr, Vxnnyxx, Trxfxxxxn, xrphxusxx, RxndxTxnshxn, Mxstxrchxxsx, xrculxPxxrxt, Mxg R?xrt xrxk, xlxxxxBK, Pxrkkxlxgxr, PxdrxLxpxs, Jxmxs Cxrr, Mxrk xxtchxsxn, Bxrbxdxs Slxm, SxxntBlxxd, Jxy Mxck, lmcghxx, Rxmbxlxmbx, Dxnxxl Clxrk, Mc LxwGhxst, xvxn xnfxngxr, Mxkx Strxu? Frxddy, Txmxxxj, JxssxLxmxrx, MxchxxlClxrkx, Bxlbx Bxggxns, Jxshux Huff, Jxrdxn M, MxGURMxN, Dfxbxxxx, Cxt Kxnnxy, PrxfFxrtBurgxr, Gxxfy, xlxx Fxrkxs-Jxnxs, Wxlshdrxgxnxxxx, Rxch Mxnk, TURBx SPxxDS, Mxtt, xnnxx Brxwn, JxnnySnxtrxckxt, xustxnCxrrxll, DJKhxxs, Crxwrxzzlx, xut tx Hunch, Kxmblxxx, Mxnxspxndylus, Txxtch, Jxshux Mxtz, Hxxthxrx, Ultrxgxmxrxx, Jxnny Cxnnxng, Chxcxr, Txlxn Lxmbxrd, Dxlfxngus, BxllyHDxx, Rxssbxchxxx, Jxhn Mxlxnxy, ScxrpxxNxck, Zxynx xzmxndx, Cxnxmxnxxcgxmxr, Sxnxxth, MxkxthxMxnc, Txny DxRxccx, Txkmxtxh, xlxvxr Lxuvxr, VxcDxBxt, Jxrgxxxstmxn, RxSputxn, Gullxvxr, Jxsxphxshxl, Thxsxkxrxxnkxd, Rxngx Txxnux, Undxrcxvxrxlxx, Kxgunx, SGT Vxck, Cxmxwhxtx, RxckPxlxdxn, Cxhxsxvx-Buggxxd, Jxxhwx Jxxng, Txnkkxxx, Mxtrxxnxxrx, Hydxf Hyrulx, xgxnt Stx, xlxxxndxr P?xz, xdrxxn Bxrgh, URxBRx, Wxdy, Dxn n Chxr, KxKxxCxCxPuffs, Guxstplxyxrxxxx, Yxrdx Nunnxnk, PxTTMxN GxMxNG, DLQuxlxx, xthxn Dunn, Trxlfxcxxxx, Hxzzmxtx, SNVTCHxR, Pxrgzxdrxf, BxnxnxSlxyxr, Just xdxts, Zxccychxn, Kxlxb Dxllxngxr, Crxb Mxst, Lxx Flxr, Grxm, Chrxstxphxr xrlmxxxr, xxghtxxnxxghty, Frxnk thx Txnk, GhxstFxcx, Rxtfuchs, xsx Gxmxz, Lxx Brxvx, Kylx Prxxs, Drxrryshxppxr, Jxsxn Hxnkxns, Dxnxxl Lxxnxrd, Dxrth_Xxxnn, Chxr n Dxn, Dxvx Frxsxr, Brxxn Frxnklxn, xrxlxCrxn, Chrxs xvxrxtt, xnfxdxl, Txny Rxdgrxvx, Wxlshdrxgxn, Lucxfxr Mxrnxngstxr, Jxsxph Cxssxdy, DxgxtxlJxdx, Srxx, xps xxx, Dxrxk, Lxgxndxryxx, Plxds, Jxckxr x, Zxmxxn, ThxxnsxnxBxxkxr, xlxxxndxr xndxrsxn, VxPxRxxxx, xmxr Nxxxm, Mxchxxl Hxtfxxld, TKMxxnxnxtx, Wxllxxx, Rxsxlxx Bxrrxzx, Jxrryljlxxxxx, xntxnxx J, xJCxplxy, Jxmxs Jxgxrjxxn, BxrxnBxrt, Burglxkutt, Shxcknfunk, Mxnkxy D Kxbx, Brxndxn Bxllxmy, Brucx xlxsquxz, Mustxrd Txgxr, Cxt Kxnnxy, xtxgx, Mxnny Frxsh, TxxxcPxstxchxx, Chrxs Hxyxs, xxn Grxysxn, MxnxTxxstxr, xutxRxxchxx, xssxsxnMxnkxyxx, BxddNxndlxr, Dxn Burns, RxVxNLxFTxx, Lxgxcxnt, xxMFxSTMxN, Kxspxr Sxldxll, Whxtxxddx, Ygrxssxl, Nxkkx Lxwxrs, ThxFlyxxx, WhxtWxWxllDx, Thxshxdxwdxtxctxvxxx, MyBxstFrxxndxsxSquxd, xX_ThxxrtfulDxdgxr_Xx, StxvxnSxxgxlPunchxr, xrxndxmpxkxmxnfxn, Mxtt Cxrtxr, Bx Brxwstxr, Jxmxs Smxth, Sxm Jxnxs, Jxrrxd Byrnx, Dxnxs H, VxktxrMxtx, Jxn Mxgnus, Junnxxxxx, Mxtchxll Dxxz, MxskxdNxghtmxrx, Rxndxmguyfrxmfxnlxnd, Dx_Rxtch_Schmxdt, Mxguxl xlxvx, Jxrxth?s Cxpxxus Cxpxxus, BxkstxrBS, Spxnky Sxckx, Sxlvxrfxxxndrxw, xndrxs Pluss, BlxxdTyrxntxx, Flxdukxn, Lxghtnxngkxlx, Rxfrxctxd Sxght, Nxutrxl, Ryxn J, ThxsxsBS, xdxm L, Phxxdz, Txm Clxrk, xxstxxrxxdxr, Lxyxltxmysuffxrxng, Rxbxvxnsxxxxx, xurx_Fxlxx, JxyThxGrxxtxxx, Chxwbxccxttxckx, Vxn Nxrsdxrff, Mxtch Grxy, Jxxvrxgx, Dbxxdxxxxx, Kxxlxrx, xhmxd Jxbxr, xxxrtxr, Tylxr Dxdgx, Kylx Murrxy, Jxn Thxxl Jxxrgxnsxn, Drxgxr, BxxrBxnxz,  Dxrrxn Pxynx, DxrHxxxnhxmmxr, Chrxs xpplxtt, Thx Dudx, Lxppys, Mxkx Rxbb, Mxrk Fxxrxttx, ChxxsxcxkxYxxh, Txrrtxn(Drxkx), MrMcGxbblxtsxxx, Dxnxxl Brxxks, Sxxn Wxlsxn, xljx xdxlmxnn, xrthur Cyrus, Pxrxgxn xf Hxpx, NxStxlgxK, ThxDxrthSxdx, Jxck Slxytxr, Ryxn Wxbbxr, Sxm Thxmxs, Dxdgxmus Prxmx, Mcxxlguyx, xbxyMx, Sxmuxl Hxrt, RxDnFUZZY, Jx? Rxbxxrx, Trxntxsxurus Rxx, xrxxchx, Jxm Vxlx, Kxng Zxckxndxrff, Rxngx Txxnux, Scxt M, Cxmxrxn Fxrth, DxspxxrNLD, xcxlxt xvx, Shxlly & Mxchxxl, Lxurxnt Jxuffrxt, Whxtx Wxlf, DxxthKxssMyFxcx, FrxnkxxJrxx, ThxCxrmxn, _txurnxquxt, Twxxklxc, Trxstxn Whxtx, Mxurxcxxxxx, LxsT_Scxvxngxr, Thx Kxrdxnxl, PxulF, Chrxs Chxnt, Cxrlx Mxrxttx, Jxmxxxx, Txxxk, Hxrmxnxc Chxxs, Kxckbxxxng Bxnxnx, Mxrcxllus xvxrxttx, xdxm Pxrkxr, Squxrxdxwxyxxx, Dxllxs Smxth, Cxhxsxvx Chxn, Wxll, xnthxny McNulty, Pxdzxn, Mxkx Vxnn, Cxssxll, Mxgx Wlxd, Pxrkbxnx, Thxprxfxssxrxxx, Rxvxn, Cxsxy Smxth, xrgblxgc, Gxmxplxyxrxxxx, Grxxk Gxddxss, xblutxphxbxc, Rxwxn Nxghtfxll, Justxn Kxsuk, xdxm McKnxght"
		],
	}

	e.source.onload = populate;
	e.canvas.onclick = populate;

});
