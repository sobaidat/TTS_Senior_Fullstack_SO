"use strict";

const moment = require('moment'); 

const getGroupType = function(fromDate, toDate){
    const daysDiff = toDate.diff(fromDate, 'days');
	  
    var date_group = 'Daily';
    if(daysDiff >= 30 && daysDiff <= 89) date_group = "Weekly";
    else if(daysDiff > 89) date_group = "Monthly";

    return date_group;
};

const getGroupKey = function(reviewDate, dateGroup){
    var gKey = reviewDate.day();
    if(dateGroup === 'Monthly')
    {
        gKey = reviewDate.month();
    }
    else if(dateGroup === 'Weekly')
    {
        gKey = reviewDate.week();				
    }

    return gKey;
};

const buildGroups = function(res, dateGroup){
    var groups = [];
        
    for(var i = 0; i < res.length; i++) {
        var reviewDate = moment(res[i].reviewDate, 'DD/MM/YYYY');
        var gKey = getGroupKey(reviewDate, dateGroup);
      
        if(!groups[gKey]) {
          groups[gKey] = {"review_count" : 1, "total_score": res[i].score, "average_score": res[i].score / 1, "review_date": reviewDate};
        }
        else {
          groups[gKey]["review_count"]++;
          groups[gKey]["total_score"] += res[i].score;
          groups[gKey]["average_score"] = groups[gKey]["total_score"] / groups[gKey]["review_count"];
        }
    }

    var filtered = groups.filter(function (el) {
        return el != null;
    });

    return filtered;
};

module.exports = {
    getGroupType,
    getGroupKey,
    buildGroups
};