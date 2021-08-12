"use strict";

const boom = require( "@hapi/boom" );
const joi = require( "@hapi/joi" );
const moment = require('moment'); 
const utils = require('./utils');
const db = require('./dbHandler');

// retrieve all hotels
const allHotels = {
  method: "GET",
  path: "/api/hotels",
  handler: async ( request, h ) => {
    try {
      const res = await db.queryAllHotels(h);
      if(res.count > 0) {	
        return res;
      }else{
        return boom.notFound();
      }

    } catch ( err ) {
      console.log( err );
      return boom.serverUnavailable();
    }
  }
};

// get reviews for the current hotel by id and date range
const getReviewsForCurrentHotelById = {
  method: "GET",
  path: "/api/hotels/{id}",
  handler: async ( request, h ) => {
    try {
      const id = request.params.id;
	    const fromDate = request.query.fromDate;
	    const toDate = request.query.toDate;
      	    
      const res = await db.queryHotelByIdAndDateRange(h, id, fromDate, toDate);

      if(res.count > 0) {	
        var fromDateStrToDate = moment(fromDate, 'DD/MM/YYYY');
        var toDateStrToDate = moment(toDate, 'DD/MM/YYYY');
        
        var dateGroup = utils.getGroupType(fromDateStrToDate, toDateStrToDate);
        groups = utils.buildGroups(res, dateGroup);

        return groups;
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