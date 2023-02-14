Task Java Script: A private delivery service company in Cologne handles the collection 
and delivery of parcels for people.
This is done by bikers. 
The problems to be addressed are:
• A sender should be able to create a parcel to be delivered by specifying pick-up and drop-off 
address (should be just a text field, no need for address validation)
• A sender should be able to see the status of his parcels.
• A biker should be able to see a list of the parcels.
• A biker should be able to pick up a parcel.
• Once a parcel is picked up by a biker, it cannot be picked up by other bikers.
• A biker should be able to input the timestamp of the pickup and the delivery for each order.
• The status of the order should be updated for the sender. 
A developer should create two tools:
• A web dashboard for the sender.
• A to-do web tool for the biker. 
Technical hints:
• Hard-code 5 senders and 10 bikers.
• Create a Node.js based API server responsible for mocking authentication of the senders and 
the bikers, and for serving mock data, via REST API.
• You might consider dockerising the application and if you want you can provide a dockercompose file.
Good Luck