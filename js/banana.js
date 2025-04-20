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
		} else if (sortedTiers[i] != "") {
			names = names + "," + sortedTiers[i];
			total = total + sortedTiers[i].split(",").length;
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
		ctx.fillText(i + 1, x + 7, y);
		ctx.fillStyle = color[rank];
		ctx.textAlign = "left";
		ctx.font = `${fontHeight}px ${e.font.name}`;
		if (ctx.measureText(list[i].trim()).width < 1) {
			alert("⚠️ Empty name at #" + (i + 1) + ", check your lists for extra commas");
			ctx.fillText("?", x + 20, y + 2);
		}
		else {
			ctx.fillStyle = "#112233";
			ctx.fillText(list[i].trim(), x + 20, y + 4, (columnWidth - fontHeight * 1.5));
			ctx.fillStyle = color[rank];
			ctx.fillText(list[i].trim(), x + 20, y + 2, (columnWidth - fontHeight * 1.5));
		}
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
			"S04pV3V0, Kyl3 V4squ3z, K4t13 n K31th, Xb0st, Jugg3r Nuggs, D4v1d J4m3s K3lly, G0r3f13nd, Urm4nsh1r3, R4ym0nd G4rr1ck G0m3z, 1v4n 3nf1ng3r, Bl4ckh1ll, M0rg4smTh3P0W3RFUL, 1tt4pupu, 3r1c S1lv3rw0lf, J0rg3 G10v4nn1 V4n3g4s, 4nth0ny P3r3z",
			"P4ulF, Chr1s Ch4nt, C4rl0 M4r4tt4, J4m1990, T0x1k, H4rm0n1c Ch40s, K1ckb0x1ng B4n4n4, M4rc3llus 4v3r3tt3, 4d4m P4rk3r, Squ4r3d4w4y249, D4ll4s Sm1th, C0h3s1v3 Ch4n, W1ll, 4nth0ny McNulty, P0dz0n, M1k3 V4nn, C4ss3ll, M3g4 Wl4d, P0rkb0n3, Th3pr0f3ss0r358, R3v4n, C4s3y Sm1th, 0rgbl1gc, G4m3pl4y3r2014, Gr33k G0dd3ss, 4blut0ph0b1c, R0w3n N1ghtf4ll, Just1n K0suk, 4d4m McKn1ght, Unkn0wnB3lm0nt, Th3N00b4b1d3s, Urb4n Sh4d0ws, M33f0, 4dr13n X DuPl3ss1s, B3lg4r1n, T1m V4ngs3s, M4ntusT0b0gg4n69, Fr4d4ns, P4ul J4nz3n, B0b P3l0t, K4g3 N0 Shukun, Jty23, 4l3x D4n13ls, R33c3 lutt3rl0ch, J0nnyB0y, 4hr1m4n_3x1l3, C0rp0r4t3, Th4t SL4V Dud3, 4-V3ry-L000ng-N4m3, 4-V3ry-V3ry-L000ng-N4m3, 4-V3ry-V3ry-V3ry-L000ng-N4m3",
			"M1tch Gr4y, J03vr4g3, Db33d13222, K41l3r4, 4hm3d J4b3r, 3x0rt3r, Tyl3r D0dg3, Kyl3 Murr4y, J0n Th31l J03rg3ns3n, Dr0g4r, B34rB0n3z,  D4rr3n P4yn3, D3rH3x3nh4mm3r, Chr1s 3ppl3tt, Th3 Dud3, L4ppys, M1k3 R0bb, M4rk F10r3tt0, Ch33s3c4k3Y34h, T3rrt0n(Dr4k3), MrMcG1bbl3ts079, D4n13l Br00ks, S34n W1ls0n, 1lj4 3d3lm4nn, 4rthur Cyrus, P4r4g0n 0f H0p3, N3St4lg1K, Th3D4rthS1d3, J4ck Sl4yt3r, Ry4n W3bb3r, S4m Th0m4s, D0dg1mus Pr1m3, Mc00lguy6, 0b3yM3, S4mu3l H4rt, R3DnFUZZY, J0? R1b31r0, Tr0nt0s4urus R3x, 1r10ch1, J1m V3l4, K1ng Z3ck3nd0rff, R4ng1 T41nu1, Sc0t M, C4m3r0n F1rth, D1sp41rNLD, 0c3l0t 4v4, Sh3lly & M1ch43l, L4ur3nt J4uffr3t, Wh1t3 W0lf, D34thK1ssMyF4c3, Fr4nk13Jr13, Th3C0rm4n, _t0urn1qu3t, Tw33kl0c, Tr1st1n Wh1t3, M4ur1c33016, L0sT_Sc4v3ng3r, Th3 K4rd1n4l, M4x1m0,Rllmsyhr, Gp1n76, Bl4ckb1rd, 4ndy N, Squ1nky, F4b14n S1ngh, Ch4z3n, S4n4g4 N0t0sh1, M4ct1gb01, Syn1st3rSyd, St4g3r, F3r4lR4nchu, K13r4n Thurl0w, D3nn1z K14m1l, 43g1s7surv1v0r, J03l B0y3r, M4x D3vl1n, Br00ks W1ls0n, T1mmym4ll0y, D0wnByF1v3, R03m3z, M4tt Cl4rk3, Sm0k3&M1rr0rs, P4ulF, Chr1s Ch4nt, C4rl0 M4r4tt4, J4m1990, T0x1k, H4rm0n1c Ch40s, K1ckb0x1ng B4n4n4, M4rc3llus 4v3r3tt3, 4d4m P4rk3r, Squ4r3d4w4y249, D4ll4s Sm1th, C0h3s1v3 Ch4n, W1ll, 4nth0ny McNulty, P0dz0n, M1k3 V4nn, C4ss3ll, M3g4 Wl4d, P0rkb0n3, Th3pr0f3ss0r358, R3v4n, C4s3y Sm1th, 0rgbl1gc, G4m3pl4y3r2014, Gr33k G0dd3ss, 4blut0ph0b1c, R0w3n N1ghtf4ll, Just1n K0suk, 4d4m McKn1ght, Unkn0wnB3lm0nt, Th3N00b4b1d3s, Urb4n Sh4d0ws, M33f0, 4dr13n X DuPl3ss1s, B3lg4r1n, T1m V4ngs3s, M4ntusT0b0gg4n69, Fr4d4ns, P4ul J4nz3n, B0b P3l0t, K4g3 N0 Shukun, Jty23, 4l3x D4n13ls, R33c3 lutt3rl0ch, J0nnyB0y, 4hr1m4n_3x1l3, C0rp0r4t3, Th4t SL4V Dud3",
			"J4k3 Russ3ll, Z4c W3lsh, H3r01909, Sc0tt, T0m Cum1ns, Hulyd00ly, Ph1l1p D0v3y, 1rv1ngSh1tsm4n, J00n 4hn, N4th4n Z4gr34n, Gr33b0, Th30d0s1s, 4nth0ny D1N0v0, Luc4s Gr33n3, D4v1d D1nn33n, H0k13G4m3r, Ch4d Gr0v3r, J3rry S1mm0ns, 4hm3d, T34m HumY34h, K1dsc4llm3h0ju, W4ss4m 4, Th34lm1ghtySqu1rr3l, Z0Cks, 4nth0ny M1tch3ll, B4umbusch, Cl4ss1cZ4ch, B1g B3n, MrTurnb0lt, L1nk, Gr1zz, T4nn3r Fl4h3rty, X3v3r1n3, 4J0, B1g4l95, P4tr1ck 0'br13n, J3r3my M3rr1n, Z0ng D3ng, Ch1rs Kum4s4k4, S0n0fKr36, J4m3s T3rd1m4n, Bj?rn Grunw4ld, C4ss1dy, J4s0n F3nd3rs0n, 4sh072, J3dBull3t, 4ng3l, Sk1n4ndM4rr0w, B33rB4gs, P4r4g0n B4lk, 3nr1qu3 L30 D14z, M4rk V1ck3rs, J4m3s F0x, J4m13 Sm1th, PS Gunk13, St3v3n C0l4ntu0n0, D3rG0b1, B3n R1pl3y, M0rd3c41, X4v13r M4rt1n3z, Chr1s, Z3r0mus, 3r1n R0b3rts, L14m 0br13n, M4th14s 4l3x4nd3r, V1ct0r McD0w3ll, N0v3r14n, T4shk1-m0n1k1, Funnym4tt, M4tt1cus, M13X, J77m3l, C0n0r Qu1nc3y, J0n Sn0w, RJ1m3n3z77, L33, Xzh0u, D4rkM4rcus1987, S0m3guy, J4zz H4nds, K3l4, S34N0rr1s, 4l3x B, M3g4v0lt67, Sc1H3r0, 4l3x M4nr0ss, Th3L04f3rM4n, Sn4k3w1z4rd, Wh1t3v3n0m, Ut3rus M4x1mus, K41juJ0hnny, R3D W0LF 99, R1ck K0rp3rsh03k, G0t4d4m, K4ss1us, St0cky81, R4gn4r3x, Z4ST1Nx, Th0m4s J0n3s, 4g3nnn0000, 0nyx RT1, Blu34ppl3s, Th3J4ck4l, Th3 L4ugh1ng M4n, M4ttydr34d, Luk3 Fr0gg4tt, Chr1st0ph3r H4rr0w, W1ll J0n3s, 1v3r B1ggun, J3ff 4zur3, L4mb0, W4yl0n, W4rl0rd, Th3M01rd4, Und3rh1ll, G3r4lt_0f_R1v14, S34n K1ng, D4rk4ng3lR4f43l, 414B3g, M1st3r Sp0rk, Chr0n0bunny, D4rkl1nk11, Lunchm34t5000, M4tt B3rgm4n, C4tt1v0, M4tt C0rry, M4rt1jn Gr00t, Y0ungst473, Hyp3rd34th84, B1g D4ddy Sw00th, R1qu1nn1, D4v1dg1ln, St3v13 W1nw00d, J4m13 W1ld3, D4rylK4l-3l, H4m4n K4rn, 1sl3t 0f L4ng3rh4ns, C4rl0 Gu1d0tt1, M1k3 N3ls0n, 4l3x S13ckm4nn, 4ppl3j4cks1991, S1r N0, Grubm4n, S1nb4d17, K3v1n K1mm3l, 0ldr3d_s4, Th0n, B0llyw0ng4l01d, Hy0sung4RD, S1m0n D. M4gus, M4l13, T0yyyyyyy, Sp4n4n4, Th3D4rkT0w3r, R1l3y M0rr1s, 4ng3l 3y3s, W1ls1sc0, M4nu3lF, Dr3w, Kn1ght 4rch13, W4t3r1ngc4n2, 4C3R4r1n, H34vy4rm7, H1pp3us0m3g4, Wr4th3094, J3ff R0ss, R00Kz, Uh0h J4m4r10, Br4nd0nC, 1Sh4d0w0ps, C4lv3y, K13r4n5990, 4l4sp00rj0rd4n, C0l0ss01d, D01tsun0ch0j1n, T3rdz0r, Ch3styc4t, K3N B3G00T, M4tt R31d, D4v1d Tr3ss, 4l3x.P, P4p4_G4sc01gn3, 34zyM1ch43l, Ult1m4t3 K, 1Lynchy, CJ, Th3Pursu3r, V1nny31, Tr1f1x10n, 0rph3us34, R4nd0T3nsh1n, M4st3rch33s3, 0rcul3P01r0t, M4g R?3rt 3r1k, 4l3x21BK, P1rkk4l4g3r, P3dr0L0p3s, J4m3s C4rr, M4rk 41tch1s0n, B4rb4d0s Sl1m, S41ntBl00d, J4y M4ck, lmcgh33, R0mb4l0mb4, D4n13l Cl4rk, Mc L0wGh0st, 1v4n 3nf1ng3r, M1k3 Str4u? Fr3ddy, T0m555j, J3ss3L4m3r3, M1ch43lCl4rk3, B1lb0 B4gg1ns, J0shu4 Huff, J0rd4n M, M3GURM4N, Df4b3017, C4t K3nn3y, Pr0fF4rtBurg3r, G00fy, 4l3x F4rk4s-J0n3s, W3lshdr4g0n2007, R1ch M0nk, TURB0 SP33DS, M4tt, 4nn13 Br0wn, J0nnySn0tr0ck3t, 4ust1nC4rr3ll, DJKh40s, Cr4wr1zzl3, 0ut t0 Hunch, K1mbl389, M4n0sp0ndylus, T00tch, J0shu4 M4tz, H34th3r3, Ultr4g4m3r50, J0nny C4nn1ng, Ch4c3r, T4l0n L0mb4rd, D0lf1ngus, B1llyHD87, R0ssb4ch451, J0hn M0l0n3y, Sc0rp10N1ck, Z4yn3 0zm4nd3, C1n3m4n14cg4m3r, S1n14th, M1k3th4M4nc, T0ny D1R0cc0, T3km4t3h, 0l1v3r L3uv3r, V1cD4B0t, J0rg334stm4n, R4Sput1n, Gull1v3r, J0s3ph1sh4l, Th1s1k0r34nk1d, R4ng1 T41nu1, Und3rc0v3r4l3x, K4gun3, SGT V1ck, C0m4wh1t3, R0ckP4l4d1n, C0h3s1v3-Bugg01d, J43hw4 J30ng, T4nkk616, M4tr1xn01r3, Hyd3f Hyrul3, 4g3nt St3, 4l3x4nd3r P?3z, 4dr14n B3rgh, UR0BR0, W0dy, D4n n Ch4r, K1K14C0C0Puffs, Gu3stpl4y3r1996, Y0rd1 Nunn1nk, P1TTM4N G4M1NG, DLQu4l14, 3th4n Dunn, Tr0lf4c3101, H4zzm4t1, SNVTCH3R, P3rgz3dr3f, B4n4n4Sl4y3r, Just 3d1ts, Z4ccych4n, K4l3b D3ll1ng3r, Cr4b M4st, L3x Fl0r, Gr1m, Chr1st0ph3r 3rlm313r, 31ght33n31ghty, Fr4nk th3 T4nk, Gh0stF4c3, R0tfuchs, 1s4 G0m3z, L34 Br4v0, Kyl3 Pr34s, Dr4rrysh1pp3r, J4s0n H4nk1ns, D4n13l L30n4rd, D4rth_X10nn, Ch4r n D4n, D4v3 Fr4s3r, Br14n Fr4nkl1n, 4r4l4Cr4n, Chr1s 3v3r3tt, 1nf1d3l, T0ny R3dgr4v3, W3lshdr4g0n, Luc1f3r M0rn1ngst4r, J0s3ph C4ss1dy, D1g1t4lJ3d1, Sr31, 0ps 223, D3r3k, L3g3nd4ry3x, Pl4ds, J4ck3r 5, Z1m14n, Th31ns4n3B34k3r, 4l3x4nd3r 4nd3rs0n, V1P3R1879, 0m3r N433m, M1ch43l H4tf13ld, TKM00n1n1t3, W4ll491, R0s4l10 B4rr4z4, J3rryljl19982, 4nt0n10 J, 4JC0pl3y, J4m3s J1g4rj14n, B4r0nB4rt, Burgl3kutt, Sh0cknfunk, M0nk3y D K0b3, Br3nd4n B3ll4my, Bruc3 4l4squ3z, Must4rd T1g3r, C4t K3nn3y, 4t4g3, M4nny Fr3sh, T0x1cP1st4ch10, Chr1s H4y3s, 14n Gr4ys0n, M1n4T04st3r, 0ut4R34ch94, 4ss4s1nM0nk3y21, B4ddN0ndl4r, D4n Burns, R4V3NL0FT99, L3g1c3nt, 14MF4STM4N, K4sp3r S4ld3ll, Wh1t34dd4, Ygr4ss1l, N1kk1 L0w3rs, Th3Fly212, Wh4tW3W1llD0, Th3sh4d0wd3t3ct1v312, MyB3stFr13nd1s4Squ1d, xX_Th34rtfulD0dg3r_Xx, St3v3nS34g4lPunch3r, 4r4nd0mp0k3m0nf4n, M4tt C4rt3r, B0 Br3wst3r, J4m3s Sm1th, S4m J0n3s, J4rr0d Byrn3, D3n1s H, V1kt0rM4t3, J0n M4gnus, Junn31983, M1tch3ll D14z, M4sk3dN1ghtm4r3, R4nd0mguyfr0mf1nl4nd, D4_R1tch_Schm1dt, M1gu3l 0l1v4, J4r3th?s C0p10us C0p10us, B0kst3rBS, Sp4nky S0ck3, S1lv3rf0x4ndr3w, 4ndr3s Pluss, Bl00dTyr4nt91, Fl4duk3n, L1ghtn1ngk3l0, R3fr4ct3d S1ght, N3utr4l, Ry4n J, Th1s1sBS, 4d4m L, Ph34dz, T0m Cl4rk, 34st83r41d3r, L0y4lt0mysuff3r1ng, R0b3v4ns10013, 4ur1_F3l1x, J4yTh3Gr34t218, Ch3wb4cc4tt4ck7, V0n N0rsd0rff, M1tch Gr4y, J03vr4g3, Db33d13222, K41l3r4, 4hm3d J4b3r, 3x0rt3r, Tyl3r D0dg3, Kyl3 Murr4y, J0n Th31l J03rg3ns3n, Dr0g4r, B34rB0n3z,  D4rr3n P4yn3, D3rH3x3nh4mm3r, Chr1s 3ppl3tt, Th3 Dud3, L4ppys, M1k3 R0bb, M4rk F10r3tt0, Ch33s3c4k3Y34h, T3rrt0n(Dr4k3), MrMcG1bbl3ts079, D4n13l Br00ks, S34n W1ls0n, 1lj4 3d3lm4nn, 4rthur Cyrus, P4r4g0n 0f H0p3, N3St4lg1K, Th3D4rthS1d3, J4ck Sl4yt3r, Ry4n W3bb3r, S4m Th0m4s, D0dg1mus Pr1m3, Mc00lguy6, 0b3yM3, S4mu3l H4rt, R3DnFUZZY, J0? R1b31r0, Tr0nt0s4urus R3x, 1r10ch1, J1m V3l4, K1ng Z3ck3nd0rff, R4ng1 T41nu1, Sc0t M, C4m3r0n F1rth, D1sp41rNLD, 0c3l0t 4v4, Sh3lly & M1ch43l, L4ur3nt J4uffr3t, Wh1t3 W0lf, D34thK1ssMyF4c3, Fr4nk13Jr13, Th3C0rm4n, _t0urn1qu3t, Tw33kl0c, Tr1st1n Wh1t3, M4ur1c33016, L0sT_Sc4v3ng3r, Th3 K4rd1n4l, P4ulF, Chr1s Ch4nt, C4rl0 M4r4tt4, J4m1990, T0x1k, H4rm0n1c Ch40s, K1ckb0x1ng B4n4n4, M4rc3llus 4v3r3tt3, 4d4m P4rk3r, Squ4r3d4w4y249, D4ll4s Sm1th, C0h3s1v3 Ch4n, W1ll, 4nth0ny McNulty, P0dz0n, M1k3 V4nn, C4ss3ll, M3g4 Wl4d, P0rkb0n3, Th3pr0f3ss0r358, R3v4n, C4s3y Sm1th, 0rgbl1gc, G4m3pl4y3r2014, Gr33k G0dd3ss, 4blut0ph0b1c, R0w3n N1ghtf4ll, Just1n K0suk, 4d4m McKn1ght"
		],
	}

	e.source.onload = populate;
	e.canvas.onclick = populate;

});
