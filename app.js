const Bus = new Vue();
let countries  =   {
    data() {
        return {
            name: 'countries',
            countries: [],
            country: null,
            region: null,
            visible: false,
            countryInDetails: null,
            regionsObj : [
                { id:0, name: "Africa",},
                { id:1, name: "America",},
                { id:2, name: "Europe",},
                { id:3, name: "Asia",},
                { id:4, name: "Oceania",}
            ],
            selected: null,
            theme: null,
        }
    },
    template: `<div>
                    <div class="d-flex-form">
                        <div class="input" :class="{styleTxt : theme}">
                        <i class="fas fa-search" :class="{styleTxt : theme}"></i>
                        <input type="search" placeholder="search for a country..." v-model="country"
                            :class="{styleItems : theme, styleTxt : theme}" aria-label="find countries">
                    </div>
                <div class="filter" @click="visible = !visible" :class="{styleItems : theme, styleTxt : theme}">
                    <p>Filter By Region</p> <i class="fas fa-angle-down"></i>
                    <transition name="show">
                        <ul v-if="visible" class="filters-list" :class="{styleItems : theme, styleTxt : theme}">
                            <li v-for="(li,index) in regionsObj" :key="li.id"
                                @click="region = li.name; selected = li.id" :class="{liActive: selected === li.id}">
                                {{ li.name }}
                            </li>
                        </ul>
                    </transition>
                </div>
                        </div>
                <div v-if="!region" class="d-flex">
                    <div class='country-card' v-for='country in searchByName' :key="country.id">
                        <div class="flag" :style="{backgroundImage: 'url(' + country.flag + ')'}""
                            @click="goToDetail(country); "></div>
                            
                        <div class="details" :class="{styleItems : theme, styleTxt : theme}">
                            <p class="name"> {{ country.name }} </p>
                            <p class="population"><span :class="{styleTxt : theme}">Population</span>: {{ country.population | comma}}</p>
                            <p class="region"><span :class="{styleTxt : theme}">Region</span>: {{ !country.region? "Unknown" : country.region }}</p>
                            <p class="capital"><span :class="{styleTxt : theme}">Capital</span>: {{ !country.capital? "Unknown" : country.capital }}</p>
                            </div>
                        </div>
                </div>
                <div v-else class="d-flex">
                    <div class='country-card' v-for='country in searchByName.filter(country => country.region.match(region) )' :key="country.id">
                        <div class="flag" :style="{backgroundImage: 'url(' + country.flag + ')'}""
                            @click="goToDetail(country);">
                            </div>
                        <div class="details" :class="{styleItems : theme, styleTxt : theme}">
                            <p class="name"> {{ country.name }} </p>
                            <p class="population"><span :class="{styleTxt : theme}">Population</span>: {{ country.population | comma}}</p>
                            <p class="region"><span :class="{styleTxt : theme}">Region</span>: {{ country.region }}</p>
                            <p class="capital"><span :class="{styleTxt : theme}">Capital</span>: {{ country.capital }}</p>
                            </div>
                        </div>
                </div>
                
        </div>`,
    created() {
        this.allCountries();
        Bus.$on("changeTheme" ,val => this.theme = val)
    },
    methods: {
        allCountries() {
            fetch("https://restcountries.eu/rest/v2/all")
            .then((response) => {
                return response.json();
            }).then((result) => {
                return this.countries.push(result)
            }).catch((error) => {
                return console.log(error)
            })
        },
        goToDetail(data) {
            sessionStorage.setItem("CountryDetail", JSON.stringify(this.countryInDetails = data))
            router.push({path: "/details"});
        },
    },
    computed : {
        searchByName () {
            if (this.country) {
            let input = new RegExp(this.country, "i");
                return this.countries[0].filter(country => country.name.match(input))
            } else {
                return this.countries[0]
            }
        },
    },
    filters: {
        comma(el) {
                return Number(el).toLocaleString("en"); 
                // return new Intl.NumberFormat("en").format(el);
        },
    }
};
let countryDetail = {
    data () {
        return {
            name: 'country-detail',
            countryInDetails: null,
            theme : null,
        }
    },
    template: `<div>
                <div class="countries-details" :class="{styleBdy : theme}">
                    <button class="btn-back" @click="goBack();" :class="{styleItems : theme, styleTxt : theme,removeShadow : theme}"><i class="fas fa-long-arrow-alt-left"></i>&nbsp;&nbsp;&nbsp;Back</button>
                    <div class="d-flex-details">
                <div class="flag" :style="{backgroundImage: 'url(' + countryInDetails.flag + ')'}"></div>
                    <div class="information" :class="{styleTxt : theme}">
                    <div class="left-side">
                <p class="name">
                    {{ countryInDetails.name }}
                    </p>
                <p class="native">
                    <span :class="{styleTxtDetail : theme}">Native Name: </span>{{ countryInDetails.nativeName }}
                    </p>
                <p class="population">
                    <span :class="{styleTxtDetail : theme}">Population: </span>{{ countryInDetails.population | commaNum }}
                    </p>
                <p class="region">
                    <span :class="{styleTxtDetail : theme}">Region: </span>{{ !countryInDetails.region? "Unknown" : countryInDetails.region }}
                    </p>
                <p class="sub-region">
                    <span :class="{styleTxtDetail : theme}">Sub Region: </span>{{ !countryInDetails.subregion? "Unknown" : countryInDetails.subregion }}
                    </p>
                <p class="capital">
                    <span :class="{styleTxtDetail : theme}">Capital: </span>{{ !countryInDetails.capital? "Unknwon" : countryInDetails.capital }}
                    </p>
                    </div>
            <div class="right-side">
                <p class="domain">
                    <span :class="{styleTxtDetail : theme}">Top Level Domain: </span>{{ countryInDetails.topLevelDomain[0] }}</p>
                <p class="currencies">
                    <span :class="{styleTxtDetail : theme}">Currencies: </span>{{ countryInDetails.currencies[0].name }}&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>{{ !countryInDetails.currencies[0].symbol? "?" : countryInDetails.currencies[0].symbol }}</span>
                    </p>
                <p class="languages">
                    <span :class="{styleTxtDetail : theme}">languages: </span><span v-for="lang in countryInDetails.languages">{{ lang.name }}&nbsp;</span>
                    </p>
                    </div>
                    
                    <div class="borders-country" v-if="countryInDetails.borders == 0">
                        </div>
                        <div class="borders-country"  v-else>
                            <h5 :class="{styleTxtDetail : theme}">Country Borders:</h5>
                            <div class="borders">
                                <p v-for="border in countryInDetails.borders" :class="{styleItems : theme,removeShadow : theme}">{{border}}</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>`,
                created() {
                    this.received()
                    this.theme = JSON.parse(sessionStorage.getItem("theme"));
                    Bus.$on("changeTheme", val => this.theme = val);         
            },
                methods: {
                    received() {
                        return this.countryInDetails = JSON.parse(sessionStorage.getItem("CountryDetail"))
                    },
                    goBack() {
                        return this.$router.go(-1);
                    },
                },
                filters: {
                    commaNum(el) {
                        return Number(el).toLocaleString("en");
                    }
                }
}

const routes = [
    {   path: '/details',
        name: 'country-detail',
        component: countryDetail}
                ]
const router = new VueRouter({
    routes,
})
let vm = new Vue({
    el: "#app",
    router,
    data: {
        mode: "Dark Mode",
        icon: "far fa-moon",
        theme: false,
    },
    components: {
        'countries': countries,
        'country-detail': countryDetail,
    },
    methods: {
        changeMode() {
            this.theme = !this.theme
            Bus.$emit("changeTheme", this.theme)
            sessionStorage.setItem("theme", JSON.stringify(this.theme))
            if (this.theme) {
                this.mode = "Light Mode";
                this.icon = "far fa-sun";
            } else {
                this.mode = "Dark Mode";
                this.icon = "far fa-moon";
            }
        },
    }
})