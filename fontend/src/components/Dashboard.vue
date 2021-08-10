<template>
  <v-flex flexWrap="wrap" maxWidth="960px" mx="auto">
    <v-box :width="[1, 1/3]" :px="[0, 2]" :mb="4">
        <div class="form-group">
          <label>Hotel</label>
          <select
            class="form-control"
            v-model="selectedHotel"
            @change="fetchHotelData()">
            <option :value="hotel.id" v-for="(hotel) in hotels" :key="hotel.id">{{hotel.name}}</option>
          </select>
        </div>
    </v-box>
    <v-box :width="[1, 1/3]" :px="[0, 2]" :mb="4">
        <div class="form-group">          
          <datepicker v-model="fromDate" placeholder="Select From Date" :format="dateFormat"></datepicker>
        </div>
    </v-box>
    <v-box :width="[1, 1/3]" :px="[0, 2]" :mb="4">
        <div class="form-group">
          <datepicker v-model="toDate" placeholder="Select To Date" :format="dateFormat"></datepicker>
        </div>
    </v-box>
    
    <v-box :width="[1, 1]" :px="[0, 1]" :mb="2">
      <h1 class="title">Average Score</h1>
      <div class="section" v-if="errorMessage">
        <div class="notification is-danger" v-text="errorMessage"></div>
      </div>
      <div v-if="fetching">Getting hotel data...</div>
      <div v-if="hasData">
        <line-chart :data="chartData" :min="chartMinimum"></line-chart>        
      </div>
      <div v-if="noData">No data to display</div>
    </v-box>
  </v-flex>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import moment from 'moment';

export default {
  name: 'Dashboard',
  components: {
    Datepicker,
    moment
  },
  computed: {
    noData: function () {
      return this.hotelData.length === 0;
    },
    hasData: function () {
      return true;// this.hotelData.length > 0;
    },
    chartData: function () {
      // maps the data returned from the API into a format the chart component understands
      var data = [];
      const tmpScore = {};
      const tmpReviewCount = {};
      this.hotelData.forEach(m => {
        tmpScore[m.review_date] = Math.ceil(m.average_score) * 10       
        tmpReviewCount[m.review_date] = m.review_count  
      });
       data = [
         {name: 'Score', data: tmpScore},
         {name: 'Review Count', data: tmpReviewCount},
       ];
      return data;
    },
    chartMinimum: function () {
      // Min value is the lowest measurement down to the nearest multiple of 10
      return Math.floor(this.hotelData.reduce((prev, current) => {
        return prev.average_score < current.average_score ? prev.average_score : current.average_score;
      }, 0) / 10) * 10;
    }
  },
  data () {
    return {
      dateFormat: 'dd/MM/yyyy',
      selectedHotel: 0,
      fromDate: null,
      toDate: null,
      hotels: [],
      hotelData: [],
			fetching: false,
			errorMessage: ""
    }
  },
  mounted() {
    this.fetchHotels();
  },
  methods: {   
    formatDate: function(value) {
      if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
      }
    },     
    sortItems: function() {
      return this.hotelData.sort((a, b) => new Date(a.review_date) - new Date(b.review_date))
    },
    fetchHotels: async function () {
      this.hotels = [];
      this.fetching = true;
      this.errorMessage = "";

      const response = await fetch("http://127.0.0.1:3000/api/hotels", {
        method: "GET",
        credentials: "same-origin"
      });

      this.fetching = false;

      if (response.status === 200) {        
        const json = await response.json();
        this.hotels = json.map(m => {
          return {
            id: m.id,
            name: m.name
          }
        });
      } else {
        const json = await response.json();
        this.errorMessage = `There was an error. ${json.error} - ${json.message}`;
      }
    },
    fetchHotelData: async function () {
      this.hotelData = [];
      this.fetching = true;
      this.errorMessage = "";

      const url = "http://127.0.0.1:3000/api/hotels/" + this.selectedHotel + "?fromDate=" + this.formatDate(this.fromDate) + "&toDate=" + this.formatDate(this.toDate);
      console.log(url);
      const response = await fetch(url, {
        method: "GET",
        credentials: "same-origin"
      });

      this.fetching = false;

      if (response.status === 200) {        
        const json = await response.json();
        this.hotelData = json.map(m => {
          return {
            review_count: m.review_count,
            total_score: m.total_score,
            average_score: m.average_score,
            review_date: m.review_date
          }
        });
        this.hotelData = this.sortItems();
      } else {
        const json = await response.json();
        this.errorMessage = `There was an error. ${json.error} - ${json.message}`;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
