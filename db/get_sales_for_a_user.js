var result = db.deals.aggregate([
        { $unwind    : '$sales'},
        { $match     : { 'sales.user' : ObjectId("5351a64a3263f71b31ef083c") } },
        
    ]).pretty();
