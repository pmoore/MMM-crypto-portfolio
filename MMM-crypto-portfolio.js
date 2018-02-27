/* Magic Mirror
 * Module: MagicMirror-Crypto-Portfolio
 *
 * By SpoturDeal https://github.com/spoturdeal
 * MIT Licensed.
 */
Module.register('MMM-crypto-portfolio', {
    result: {},
    resultJson: {},
    initialSet: 0,
    defaults: {
        currency: [{name:'bitcoin',   portf: 1.2345678},
                   {name:'ripple',    portf: 1.688014},
                   {name:'litecoin',  portf: 0.382885},
                   {name:'ethereum',  portf: 3.771212}],
        conversion: 'EUR',
        showUSD: false,
        showPortfolio: true,
        showAssets: true,
        showAgainstBTC:true,
        showTotalMarketCap: false,
        displayLongNames: false,
        headers: [],
        displayType: 'detail',
        showGraphs: false,
        logoHeaderText: 'My Crypto portfolio',
        significantDigits: 2,
        coloredLogos: false,
        fontSize: 'small',
        limit: '200'
    },
    // Sparklines are the graphics
    sparklineIds: {
        bitcoin: 1,
        ethereum: 1027,
        ripple: 52,
        litecoin: 2,
        'ethereum-classic': 1321,
        nem: 873,
        stratis: 1343,
        'bitcoin-cash': 1831,
        'bitcoin-gold': 2083,
        cardano: 2010,
        dash: 131,
        eos: 1765,
        monero: 328,
        neo: 1376,
        stellar: 512,
        iota: 1720,
        tron: 1958,
        qtum: 1684,
        omisego: 1808,
        airswap: 2058,
        aelf: 2299,
        aeternity: 1700,
        aion: 2062,
        ardor: 1320,
        ark: 1586,
        augur: 1104,
        bancor: 1727,
        'basic-attention-token': 1697,
        'binance-coin': 1839,
        bitcoin: 1,
        'bitcoin-cash': 1831,
        'bitcoin-gold': 2083,
        bitshares: 463,
        byteball: 1492,
        'bytecoin-bcn': 372,
        bytom: 1866,
        cardano: 2010,
        chainlink: 1975,
        cindicator: 2043,
        cryptonex: 2027,
        dash: 131,
        decred: 1168,
        dent: 1886,
        dentacoin: 1876,
        digibyte: 109,
        digixdao: 1229,
        dogecoin: 74,
        dragonchain: 2243,
        electroneum: 2137,
        emercoin: 558,
        'enigma-project': 2044,
        eos: 1765,
        ethereum: 1027,
        'ethereum-classic': 1321,
        ethos: 1817,
        'experience-points': 1367,
        factom: 1087,
        funfair: 1757,
        gas: 1785,
        'golem-network-tokens': 1455,
        gxshares: 1750,
        hshare: 1903,
        icon: 2099,
        iota: 1720,
        kin: 1993,
        komodo: 1521,
        'kucoin-shares': 2087,
        'kyber-network': 1982,
        lisk: 1214,
        litecoin: 2,
        loopring: 1934,
        maidsafecoin: 291,
        maker: 1518,
        medibloc: 2303,
        monacoin: 213,
        monero: 328,
        neblio: 1955,
        'nebulas-token': 1908,
        nem: 873,
        neo: 1376,
        nexus: 789,
        nxt: 66,
        omisego: 1808,
        particl: 1826,
        pillar: 1834,
        pivx: 1169,
        populous: 1789,
        'power-ledger': 2132,
        qash: 2213,
        qtum: 1684,
        quantstamp: 2212,
        raiblocks: 1567,
        rchain: 2021,
        reddcoin: 118,
        'request-network': 2071,
        ripple: 52,
        salt: 1996,
        siacoin: 1042,
        'sirin-labs-token': 2313,
        smartcash: 1828,
        status: 1759,
        steem: 1230,
        stellar: 512,
        stratis: 1343,
        substratum: 1984,
        syscoin: 541,
        tenx: 1758,
        tether: 825,
        'time-new-bank': 2235,
        tron: 1958,
        vechain: 1904,
        verge: 693,
        veritaseum: 1710,
        walton: 1925,
        waves: 1274,
        wax: 2300,
        zcash: 1437,
        zclassic: 1447,
        zcoin: 1414
    },

    start: function() {
        //this.getTicker()
        this.getAllTickers()
        this.scheduleUpdate()
    },

    getStyles: function() {
        return ['MMM-crypto-portfolio.css',
                'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css']
    },

    getTicker: function() {
        var conversion = this.config.conversion
        var url = 'https://api.coinmarketcap.com/v1/ticker/?convert=' + conversion + '&limit=' + this.config.limit
        this.sendSocketNotification('READ_COINS', url)
    },

    getSingleTicker: function(coinId) {
        var conversion = this.config.conversion
        var url = 'https://api.coinmarketcap.com/v1/ticker/' + coinId+ '?convert=' + conversion
        this.sendSocketNotification('READ_COIN', url)
    },

	getAllTickers: function() {
		for (i = 0; i < this.config.currency.length; i++) {
           var curr = this.config.currency[i]
          this.getSingleTicker(curr.name)
        }
	},    
    
    getCap:  function() {
        if (this.config.showTotalMarketCap){
           var url  = 'https://api.coinmarketcap.com/v1/global/';
           this.sendSocketNotification('READ_MARKET_CAP',url)
        }
    },

    scheduleUpdate: function() {
        var self = this
        // Refresh time should not be less than 5 minutes
        //var delay = 300000
        var delay = 60000
        setInterval(function() {
            self.getAllTickers()
        }, delay)
    },

    getDom: function() {
        if (this.config.displayType == 'logo' || this.config.displayType == 'logoWithChanges') {
            this.folder = (this.config.coloredLogos ? 'colored/' : 'black-white/')
            return this.buildIconView(this.result, this.config.displayType)
        }
        var data = this.result
        var dataJson = this.resultJson
        // set the table wrapper where the data is build
        var wrapper = document.createElement('table')
        wrapper.className = this.config.fontSize + ' light MMM-crypto-portfolio'
        // set tr for header
        var tableHeader = document.createElement('tr')
        tableHeader.className = 'header-row'
        // This we build array for the column headers
        var tableHeaderValues = [
            this.translate('CURRENCY'),
            this.translate('PRICE')
        ]
        // extra selected column headers are pushed to array here
        if (this.config.showAgainstBTC){tableHeaderValues.push('BTC')}
        if (this.config.showAssets){tableHeaderValues.push(this.translate('ASSETS'))}
        if (this.config.showPortfolio){tableHeaderValues.push(this.translate('PORTFOLIO'))}
        // see what item from this.config.headers[] are needed  (-1 means is not in array)
        if (this.config.headers.indexOf('change1h') > -1) {
            tableHeaderValues.push(this.translate('CHANGE') + ' '+this.translate('ONEHOUR'))
        }
        if (this.config.headers.indexOf('change24h') > -1) {
            tableHeaderValues.push(this.translate('CHANGE') +  ' '+this.translate('ONEDAY'))
        }
        if (this.config.headers.indexOf('change7d') > -1) {
            tableHeaderValues.push(this.translate('CHANGE') +  ' '+this.translate('ONEWEEK'))
        }
        // Create the th and add for each array value
        for (var i = 0; i < tableHeaderValues.length; i++) {
            var tableHeadSetup = document.createElement('th')
            tableHeadSetup.innerHTML = tableHeaderValues[i]
            tableHeader.appendChild(tableHeadSetup)
        }
        tableHeader.style.textAlign="right";
        wrapper.appendChild(tableHeader)
        // Set the total counter to 0
        var marketCapMyWallet = 0;
        var myTotalAsset = 0;

        //for (i = 0; i < data.length; i++) {
        //    var currentCurrency = data[i]        
        var rows = []
        for (var coinId in dataJson) {
        		var currentCurrency = dataJson[coinId]
        		var currentConfigCurrency = this.config.currency.find(function(obj) { return obj.name === coinId })
            var name
            if (this.config.displayLongNames) {
                name = currentCurrency.name
            } else {
                name = currentCurrency.symbol
            }
            // calc tot marketcap of the wallet
            marketCapMyWallet += parseFloat(currentCurrency.market_cap_eur);
            
				console.log("*** Calculating cost of " + name + ": " + currentCurrency.clean_price + " (" + currentConfigCurrency.portf + ") ***")            
            // calc the total value of all assets
            myTotalAsset += currentCurrency.clean_price * currentConfigCurrency.portf
            // calc the value of the wallet for one coin
            var myWallet = (currentConfigCurrency.portf * currentCurrency.clean_price );
            // build array with values needed in table
            var tdValues = [
                name,
                currentCurrency.price
            ]
            // add the optional values to the array
            if (this.config.showAgainstBTC){
                tdValues.push('<i class="fa fa-bitcoin"></i> '+currentCurrency.price_btc)
            }
            if (this.config.showAssets) {
                tdValues.push(this.localCurrencyFormat(myWallet));
            }
            if (this.config.showPortfolio){
                tdValues.push(''+currentConfigCurrency.portf )
            }

            if (this.config.headers.indexOf('change1h') > -1) {
                tdValues.push(currentCurrency.percent_change_1h + '%')
            }
            if (this.config.headers.indexOf('change24h') > -1) {
                tdValues.push(currentCurrency.percent_change_24h + '%')
            }
            if (this.config.headers.indexOf('change7d') > -1) {
                tdValues.push(currentCurrency.percent_change_7d + '%')
            }
            
            // this value is for sorting
            if (this.config.sort === 'change24h') {
					tdValues.unshift(currentCurrency.percent_change_24h)
            } else if (this.config.sort === 'price') {
            	tdValues.unshift(currentCurrency.clean_price)
            } else if (this.config.sort === 'portf') {
            	tdValues.unshift(currentConfigCurrency.portf)
            } else {
            	var pos = this.config.currency.map(function(curr) { return curr.name }).indexOf(coinId)
            	tdValues.unshift(pos * -1)
            }
				//console.log(tdValues)
            rows.push(tdValues)           
        }
        //console.log(rows)
		
  		  rows.sort(function(a,b) {
  		  	   var sortA = a[0]
  		  	   var sortB = b[0]
  		  	   return sortB - sortA;
		  })        
        
		  for(var i = 0; i < rows.length; i++) {
		     	var trWrapper = document.createElement('tr')
            trWrapper.className = 'currency'

				var tdValues = rows[i]
				console.log(tdValues)
				tdValues.shift()        				    
            // build the td for the data in the array fill table
            for (var j = 0; j < tdValues.length; j++) {
                let currValue = tdValues[j]
                // If I am showing value then set color
                clr='white';
                // only show in percentage values
                if (currValue.includes('%')) {
                    clr = this.colorizeChange(currValue.slice(0,-1))
                }
                
                trWrapper.appendChild(this.setTd(currValue,'',(j>0?"right":"left"),clr  ));
            }
            wrapper.appendChild(trWrapper)
		  }        
        
        // if show Assets is true in config it makes sense to show the total
        if (this.config.showAssets){
            // add tr for totals
            var trWrapper = document.createElement('tr')
            trWrapper.className = 'currency total-assets'
            trWrapper.appendChild(this.setTd(this.translate('TOTAL'),'','left','',(this.config.showAgainstBTC?3:2)));
            wrapper.appendChild(trWrapper)
            trWrapper.appendChild(this.setTd(this.localCurrencyFormat(myTotalAsset),'','right') );
            wrapper.appendChild(trWrapper)

        }
        var d = new Date();
        var n = d.toLocaleTimeString();
        // add the total market cap of the selected coins on top of table
        var tableCaption = document.createElement('caption');
        tableCaption.id='market_cap';
        if (this.config.showTotalMarketCap){
           tableCaption.innerHTML = this.translate('MARKCAP')+ " (" + n.substr(0,5)+"): " + this.localCurrencyFormat(marketCapMyWallet)
        }
        wrapper.appendChild(tableCaption);
        return wrapper
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'COINS_DATA') {
            this.result = this.getWantedCurrencies(this.config.currency, payload)
            this.updateDom()
            this.getCap()
		  } else if (notification === 'COIN_DATA') {
		  		this.updateCurrencyJson(payload)
		  		this.initialSet++
		  		if (this.initialSet == this.config.currency.length) {
		  			console.log("*** ALL DONE FETCHING, UPDATING DOM ***")
		  			this.updateDom()
		  			this.getCap()
		  		}
        } else if (notification ==='MARKET_CAP_DATA'){
            document.getElementById('market_cap').innerHTML=this.translate("TOTALGLOBALCAP")+": " + payload.total_market_cap_usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        }

    },
    /**
     * Returns configured currencies
     *
     * @param chosenCurrencies
     * @param apiResult
     * @returns {Array}
     */
    getWantedCurrencies: function(chosenCurrencies, apiResult) {
        var filteredCurrencies = []
        for (var i = 0; i < chosenCurrencies.length; i++) {
            for (var j = 0; j < apiResult.length; j++) {
                var userCurrency = chosenCurrencies[i]
                var remoteCurrency = apiResult[j]

                if (userCurrency.name == remoteCurrency.id) {
                    remoteCurrency = this.formatPrice(remoteCurrency)
                    filteredCurrencies.push(remoteCurrency)
                }
            }
        }
        return filteredCurrencies
    },
    
    
    /**
     * Updates resultJson with new apiResult
     *
     * @param apiResult
     */
    updateCurrencyJson: function(apiResult) {
		  var remoteCurrency = apiResult[0]
		  var formattedCurrency = this.formatPrice(remoteCurrency)		  
		  this.resultJson[remoteCurrency.id] = formattedCurrency
    },

    /**
     * Formats the price of the API result and adds it to the object with simply .price as key
     * instead of price_eur
     *
     * @param apiResult
     * @returns {*}
     */
    formatPrice: function(apiResult) {
        var rightCurrencyFormat = this.config.conversion.toLowerCase()

        // rounding the price in Conversion
        var unroundedPrice = apiResult['price_' + rightCurrencyFormat]
        var digitsBeforeDecimalPoint = Math.floor(unroundedPrice).toString().length
        var requiredDigitsAfterDecimalPoint = Math.max(this.config.significantDigits - digitsBeforeDecimalPoint, 2)
        var price = this.roundNumber(unroundedPrice, requiredDigitsAfterDecimalPoint)
        console.log("config.language: " + config.language);

        // add the currency string
        apiResult['price'] = price.toLocaleString(config.language, { style: 'currency', currency: this.config.conversion })
        // clean prices are needed to make assets calculations
        apiResult['clean_price']=unroundedPrice;
        if (rightCurrencyFormat != 'usd' && this.config.showUSD) {
            // rounding the priceUSD
            var unroundedPriceUSD = apiResult['price_usd']
            var digitsBeforeDecimalPointUSD = Math.floor(unroundedPriceUSD).toString().length
            var requiredDigitsAfterDecimalPointUSD = Math.max(this.config.significantDigits - digitsBeforeDecimalPointUSD, 2)
            var priceUSD = this.roundNumber(unroundedPriceUSD, requiredDigitsAfterDecimalPointUSD)
            // clean prices are needed to make assets calculations
            apiResult['clean_price_usd'] = unroundedPriceUSD;
            apiResult['price'] += ' / ' + priceUSD.toLocaleString(config.language, { style: 'currency', currency: 'USD' })
        }

        return apiResult
    },
    /**
     * Rounds a number to a given number of digits after the decimal point
     *
     * @param number
     * @param precision
     * @returns {number}
     */
    roundNumber: function(number, precision) {
        var factor = Math.pow(10, precision)
        var tempNumber = number * factor
        var roundedTempNumber = Math.round(tempNumber)
        return roundedTempNumber / factor
    },
    /**
     * Creates the icon view type
     *
     * @param apiResult
     * @param displayType
     * @returns {Element}
     */
    buildIconView: function(apiResult, displayType) {

        var wrapper = document.createElement('div')
        // make header
        var header = document.createElement('header')
        header.className = 'module-header'
        header.id = 'market_cap'
        header.innerHTML = this.config.logoHeaderText



        //only add header if there is a logoHeaderText
        if (this.config.logoHeaderText !== '') {
            wrapper.appendChild(header)
        }
        // make the table for the icon view
        var table = document.createElement('table')
        table.className = 'medium MMM-crypto-portfolio-icon'
        var myTotalAsset = 0;
        // use the selected coins
        for (var j = 0; j < apiResult.length; j++) {
            //make row for table the table top row consists of td[1] icon, td[2] amounts in table, td[3]Sprkline graphic
            var tr = document.createElement('tr')
            tr.className = 'icon-row'
            // td icon
            var tdLogoWrapper = document.createElement('td')
            tdLogoWrapper.className = 'icon-field'
            if (this.imageExists(apiResult[j].id)) {
                var logo = new Image()
                logo.src = '/MMM-crypto-portfolio/' + this.folder + apiResult[j].id + '.png'
                logo.style.maxWidth="50px";
                logo.style.maxHeight="50px";
                tdLogoWrapper.appendChild(logo)
            } else {
                this.sendNotification('SHOW_ALERT', {
                    timer: 5000,
                    title: 'MMM-crypto-portfolio',
                    message: '' +
                        this.translate('IMAGE') + ' ' + apiResult[j].id + '.png ' + this.translate('NOTFOUND') + ' /MMM-crypto-portfolio/public/' + this.folder
                })
            }
            var tdPriceWrapper = document.createElement('td');
            // ts table amount
            tdPriceWrapper.className='icon-col'
            var valuesText='<table><tr style="line-height:10px;"><td class="pricedetail tal">' + this.translate('PRICE') + '</td><td class="pricedetail tar">' + this.localCurrencyFormat(apiResult[j].price) + "</td></tr>";
            // there is no clean_price conversion here so use the price_ + conversion
            cPrice = apiResult[j]['price_' + this.config.conversion.toLowerCase()];
            // calculatie totals
            myTotalAsset += this.config.currency[j].portf * cPrice;
            var myWallet=(this.config.currency[j].portf * cPrice);
            var portfolio = this.config.currency[j].portf;
            var againstBTC = apiResult[j].price_btc;
            //fill the table with the amounts
            if (this.config.showAssets){
               valuesText += '<tr style="line-height:12px;"><td class="pricedetail tal">' + this.translate('ASSETS') + '</td><td class="pricedetail tar">' + this.localCurrencyFormat(myWallet) + "</td></tr>";
            }
            if (this.config.showPortfolio){
               valuesText += '<tr style="line-height:12px;"><td class="pricedetail tal">' + this.translate('PORTFOLIO') + '</td><td class="pricedetail tar">' + portfolio +"<td></tr>";
            }
            if (this.config.showAgainstBTC){
               valuesText += '<tr style="line-height:12px;"><td class="pricedetail tal">Bitcoin</td><td class="pricedetail"><i class="fa fa-bitcoin tar"></i> ' + againstBTC +"<td></tr>";
            }
            if (displayType == 'logoWithChanges') {
               var clr = this.colorizeChange(apiResult[j].percent_change_1h)
               valuesText += '<tr style="line-height:12px;"><td class="pricedetail tal">' + this.translate('CHANGE') + ' '+this.translate('ONEHOUR') + '</td><td class="pricedetail tar clr'+clr+'">' + apiResult[j].percent_change_1h + '%<td></tr>';
               clr = this.colorizeChange(apiResult[j].percent_change_24h)
               valuesText += '<tr style="line-height:12px;"><td class="pricedetail tal">' + this.translate('CHANGE') + ' '+this.translate('ONEDAY') + '</td><td class="pricedetail tar clr'+clr+'">' + apiResult[j].percent_change_24h + '%<td></tr>';
               clr = this.colorizeChange(apiResult[j].percent_change_7d)
               valuesText += '<tr style="line-height:12px;"><td class="pricedetail tal">' + this.translate('CHANGE') + ' '+this.translate('ONEWEEK') + '</td><td class="pricedetail tar clr'+clr+'">' + apiResult[j].percent_change_7d + '%<td></tr>';

            }
            // close td[2] table amounts
            valuesText+="</table>";

            tr.appendChild(tdLogoWrapper);
            tr.appendChild(this.setTd(valuesText,'icon-row'));
            // td[3] graphics
            if (this.config.showGraphs) {
                var tdGraphWrapper = document.createElement('td')
                tdGraphWrapper.className = 'graph-yellow';
                tdGraphWrapper.style.padding = "0px";
                if (this.sparklineIds[apiResult[j].id]) {
                    var graph = document.createElement('img')
                    graph.src = 'https://files.coinmarketcap.com/generated/sparklines/' + this.sparklineIds[apiResult[j].id] + '.png?cachePrevention=' + Math.random()
                    graph.style.maxWidth = "164px";
                    graph.style.maxHeight = "48";
                    graph.color = 'yellow';
                    graph.style.margin = "0px";
                    graph.style.padding = "0px";
                    tdGraphWrapper.appendChild(graph)
                }
                tr.appendChild(tdGraphWrapper)
            }
            table.appendChild(tr);
        }
        // use the total value of the assets as set in config
        if (this.config.showAssets){
            var tr = document.createElement('tr');
            tr.appendChild(this.setTd(this.translate("TOTALASSETS"),"pricedetail"));
            tr.appendChild(this.setTd(this.localCurrencyFormat(myTotalAsset),"pricedetail","right"));
            table.appendChild(tr);
        }
        wrapper.appendChild(table)
        return wrapper
    },
    /**
     * Checks if an image with the passed name exists
     *
     * @param currencyName
     * @returns {boolean}
     */
    imageExists: function(currencyName) {
        var imgPath = '/MMM-crypto-portfolio/' + this.folder + currencyName + '.png'
        var http = new XMLHttpRequest()
        http.open('HEAD', imgPath, false)
        http.send()
        return http.status != 404
    },
    colorizeChange: function(change) {
        if (change < 0) {
            return 'red'
        } else if (change > 0) {
            return 'green'
        } else {
            return 'white'
        }
    },
    /**
     * Load translations files
     * @returns {{en: string, de: string, it: string}}
     */
    getTranslations: function() {
        return {
            en: 'translations/en.json',
            de: 'translations/de.json',
            it: 'translations/it.json',
            nl: 'translations/nl.json'
        }
    },
    formatMoney: function(n,c, d, t){
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    },
    /**
     * Uses the local setting from Pi to set  locale format
     */
    localCurrencyFormat: function (amount){
        return amount.toLocaleString(config.language, { style: 'currency', currency: this.config.conversion })
    },
    /*
     *@ inHTML = innerHTML
     *@ cName  = classname
     *@ tAlign = textAlign
     *@ clr    = color
     */
    setTd: function (inHTML,cName,tAlign,clr,cSpan){
        var newTD = document.createElement('td');
        newTD.style.textAlign=(tAlign?tAlign:'left');
        if (cSpan){ newTD.colSpan=cSpan; }
        newTD.style.color=(clr?clr:'white');
        newTD.className=cName;
        newTD.innerHTML=inHTML;
        return newTD;
    }
})
