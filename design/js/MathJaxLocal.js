MathJax.Hub.Config({
	jax: ["input/TeX","output/HTML-CSS"],
  extensions: ["tex2jax.js","MathMenu.js","MathZoom.js"],
  tex2jax: 
		{
			inlineMath: [ ['$','$'], ['\\(','\\)'] ],
			displayMath: [ ['$$','$$'], ['\\[','\\]'] ],
			processEscapes: true
		},
	TeX:
		{ 
			equationNumbers: { autoNumber: "AMS" },
			TagSide: "left",
  		Macros:
  			{
  				b: ['\\overline{#1}',1],
  				h: ['\\widehat{#1}',1],
  				til: ['\\widetilde{#1}',1],
				bold: ['\\mathbf{#1}',1],  				
  				sans: ['\\mathsf{#1}',1],
 				vect:	['\\boldsymbol{\\mathbf{#1}}',1],
 				zeros: ['\\mathbf{0}'],
 				ones: ['\\mathbf{1}'],
 				complex: ['\\mathbf{C}'],
 				C: ['\\mathsf{c}'],
				d: ['\\,d'],
 				expect: ['\\mathbf{E}'],
 				emf: ['\\mathscr{E}'],
 				ft: ['\\mathcal{F}'],
 				Lagrange: ['\\mathscr{L}'],
 				naturals: ['\\mathbf{N}'],
 				normal: ['\\mathcal{N}'],
 				prob: ['\\mathbf{P}'],
 				pset: ['\\mathcal{P}'],
 				rationals: ['\\mathbf{Q}'],
 				reals: ['\\mathbf{R}'],
 				ereals: ['\\overline{\\mathbf{R}}'],
 				risk: ['\\mathcal{R}'],
 				integers: ['\\mathbf{Z}'],
 				symdiff: ['\\,\\Delta\\,'],
 				grad: ['\\nabla'],
 				emptyset: ['\\varnothing'],
 				ortho: ['{\\bot}'],
 				deq: [':='],
 				given: ['\\mid'],
 				midgiven: ['\\;\\middle\\vert\\;'],
 				set: ['\\{\\, #1 \\,\\}', 1],
 				inner: ['\\langle#1,#2\\rangle', 2],
 				ave: ['\\langle #1 \\rangle', 1],
 				innerlr: ['\\left\\langle#1,#2\\right\\rangle', 2],
 				avelr: ['\\left\\langle#1\\right\\rangle', 1],
 				T: ['\\top'],
 				abs: ['\\lvert#1\\rvert', 1],
 				abslr:['\\left\\lvert#1\\right\\rvert', 1],
				norm: ['\\lVert#1\\rVert', 1],
				normlr: ['\\left\\lVert#1\\right\\rVert', 1],
				zeronorm: ['\\norm{#1}_0', 1],
				zeronormlr: ['\\normlr{#1}_0', 1],
				onenorm: ['\\norm{#1}_1', 1],
				onenormlr: ['\\normlr{#1}_1', 1],
				twonorm: ['\\norm{#1}_2', 1],
				twonormlr: ['\\normlr{#1}_2', 1],
				inftynorm: ['\\norm{#1}_\\infty', 1],
				inftynormlr: ['\\normlr{#1}_\\infty', 1],
				pnorm: ['\\norm{#1}_p', 1],
				pnormlr: ['\\normlr{#1}_p', 1],
				Frobnorm: ['\\norm{#1}_\\mathrm{F}', 1],
				Frobnormlr: ['\\normlr{#1}_\\mathrm{F}', 1],
				maxnorm: ['\\norm{#1}_\\mathrm{max}', 1],
				maxnormlr:  ['\\normlr{#1}_\\mathrm{max}', 1],
				tvnorm: ['\\norm{#1}_\\mathrm{TV}', 1],
				tvnormlr: ['\\normlr{#1}_\\mathrm{TV}', 1],
				ind: ['\\mathbf{I}_{\\{ #1 \\} }', 1],
				pind: ['\\mathbf{I}(#1)', 1],
				argmin: ['\\mathop{\\mathrm{arg\\,min}}'],
				argmax: ['\\mathop{\\mathrm{arg}\\,\\max}'],
				bdiag: ['\\mathop{\\mathrm{bdiag}}'],
				bd: ['\\mathop{\\mathrm{bd}}'],
				comb: ['\\mathop{\\mathrm{comb}}'],
				codom: ['\\mathop{\\mathrm{codim}}'],
				diag: ['\\mathop{\\mathrm{diag}}'],
				dom: ['\\mathop{\\mathrm{dom}}'],
				epi: ['\\mathop{\\mathrm{epi}}'],
				hard: ['\\mathop{\\mathrm{hard}}'],
				interior: ['\\mathop{\\mathrm{int}}'],
				MSE: ['\\mathop{\\mathrm{MSE}}'],
				modop: ['\\mathop{\\mathrm{mod}}'],
				minimize: ['\\mathop{\\mathrm{minimize}}'],
				maximize: ['\\mathop{\\mathrm{maximize}}'],
				midop: ['\\mathop{\\mathrm{mid}}'],
				nint: ['\\mathop{\\mathrm{nint}}'],
				pen: ['\\mathop{\\mathrm{pen}}'],
				Poisson: ['\\mathop{\\mathrm{Poisson}}'],
				rect: ['\\mathop{\\mathrm{rect}}'],
				RMSE: ['\\mathop{\\mathrm{RMSE}}'],
				range: ['\\mathop{\\mathrm{range}}'],
				relint: ['\\mathop{\\mathrm{relint}}'],
				rank: ['\\mathop{\\mathrm{rank}}'],
				st: ['\\mathop{\\mathrm{subject\\ to}}'],
				sinc: ['\\mathop{\\mathrm{sinc}}'],
				sign: ['\\mathop{\\mathrm{sign}}'],
				sgn: ['\\mathop{\\mathrm{sgn}}'],
				soft: ['\\mathop{\\mathrm{soft}}'],
				skewop: ['\\mathop{\\mathrm{skewop}}'],
				symop: ['\\mathop{\\mathrm{symop}}'],
				SNR: ['\\mathop{\\mathrm{SNR}}'],
				spanop: ['\\mathop{\\mathrm{span}}'],
				tr: ['\\mathop{\\mathrm{tr}}'],
				var: ['\\mathop{\\mathrm{var}}'],
				MinProb: ['\\begin{aligned}' +
					'&\\minimize_{#1} & & {#2}' +
					'\\end{aligned}', 2],	
				ConMinProb: ['\\begin{aligned}' +
					'&\\minimize_{#1} & & #2 \\\\' +
					'&\\st & & #3' +
					'\\end{aligned}', 3],
				MaxProb: ['\\begin{aligned}' +
					'&\\maximize_{#1} & & {#2}' +
					'\\end{aligned}', 2],	
				ConMaxProb: ['\\begin{aligned}' +
					'&\\maximize_{#1} & & #2 \\\\' +
					'&\\st & & #3' +
					'\\end{aligned}', 3],
				ArgMinProb: ['\\begin{aligned}' +
					'#1 = &\\argmin_{#2} & & {#3}' +
					'\\end{aligned}', 3],
				ArgConMinProb: ['\\begin{aligned}' +
					'#1 = &\\argmin_{#2} & & {#3} \\\\' +
					'&\\st & & #4' +
					'\\end{aligned}', 4],
				ArgMaxProb: ['\\begin{aligned}' +
					'#1 = &\\argmax_{#2} & & {#3}' +
					'\\end{aligned}', 3],
				ArgConMaxProb: ['\\begin{aligned}' +
					'#1 = &\\argmax_{#2} & & {#3} \\\\' +
					'&\\st & & #4' +
					'\\end{aligned}', 4]
	      }
		},
	"HTML-CSS": { availableFonts: ["TeX"] }
	});
	MathJax.Ajax.loadComplete("http://drz.ac/javascripts/MathJaxLocal.js");