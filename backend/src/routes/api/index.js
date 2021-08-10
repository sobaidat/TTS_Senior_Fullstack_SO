"use strict";

const boom = require( "@hapi/boom" );
const joi = require( "@hapi/joi" );
const moment = require('moment'); 

// retrieve all hotels
const allHotels = {
  method: "GET",
  path: "/api/hotels",
  handler: async ( request, h ) => {
    try {
      const hotels = await h.sql`SELECT
            id
            , name
        FROM  hotel
        ORDER BY
            name`;
      return hotels;
    } catch ( err ) {
      console.log( err );
      return boom.serverUnavailable();
    }
  }
};


// get reviews for the current hotel by id
const getReviewsForCurrentHotelById = {
  method: "GET",
  path: "/api/hotels/{id}",
  handler: async ( request, h ) => {
    try {
      const id = request.params.id;
	    const fromDate = request.query.fromDate;
	    const toDate = request.query.toDate;
      console.log(fromDate);
      console.log(toDate);

	    var fromDateStrToDate = moment(fromDate, 'DD/MM/YYYY');
	    var toDateStrToDate = moment(toDate, 'DD/MM/YYYY');
      console.log(fromDateStrToDate);
      console.log(toDateStrToDate);
     
	    const daysDiff = toDateStrToDate.diff(fromDateStrToDate, 'days');
	  
      const res = await h.sql`SELECT
            hotel_id,
            score
            , comment 
            , to_char(created_date, 'DD/MM/YYYY') AS "reviewDate"
        FROM  review
        WHERE hotel_id = ${id} AND TO_DATE(to_char(created_date, 'DD/MM/YYYY'), 'DD/MM/YYYY') >= TO_DATE(${fromDate}, 'DD/MM/YYYY') AND TO_DATE(to_char(created_date, 'DD/MM/YYYY'), 'DD/MM/YYYY') < TO_DATE(${toDate}, 'DD/MM/YYYY')`;
      
	  if(res.count > 0)
	  {
      var date_group = 'Daily';
      if(daysDiff >= 30 && daysDiff <= 89) date_group = "Weekly";
      else if(daysDiff > 89) date_group = "Monthly";
      
      console.log(daysDiff);
      console.log(date_group);
      
      var groups = [];
      var json = {};		
      
      for(var i = 0; i < res.length; i++) {
        var reviewDate = moment(res[i].reviewDate, 'DD/MM/YYYY');
        var gKey = reviewDate.day();
        if(date_group === 'Monthly')
        {
          gKey = reviewDate.month();
        }
        else if(date_group === 'Weekly')
        {
          gKey = reviewDate.week();				
        }
        
        if(!groups[gKey]) 
        {
          json = {"review_count" : 1, "total_score": res[i].score, "average_score": res[i].score / 1, "review_date": reviewDate};
          groups[gKey] = json;
        }
        else 
        {
          groups[gKey]["review_count"]++;
          groups[gKey]["total_score"] += res[i].score;
          groups[gKey]["average_score"] = groups[gKey]["total_score"] / groups[gKey]["review_count"];
        }
      }

      var filtered = groups.filter(function (el) {
        return el != null;
      });
      
      //console.log(filtered);
      return filtered;
	  }else{
		  return boom.notFound();
	  }
    } catch ( err ) {
      console.log( err );
      return boom.serverUnavailable();
    }
  },
  options: {
    validate: {
      params: joi.object( {
        id: joi.number().integer().message( "id parameter must be number" )
      } )
    }
  }
};

module.exports = [
  allHotels,
  getReviewsForCurrentHotelById,
];