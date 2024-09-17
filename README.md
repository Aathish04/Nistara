# Nistara

Nistara is a decentralised disaster management application with an intuituve social media UI. Users can create "posts" which will be classified as a request for help/items, willingness to donate items or information/updates about the current scenario. 

These "posts" i.e., the requests and the donations will be automatched based on the broad categories of resources being provided/requested for (classified by our classification engine), and the similarity of the item matches and location proximity of the requester and donater. Essentially we have provided a comprehensive solution for crowdsouring disaster relief. 

One really cool thing about Nistara is that we have leveraged the microservices architecture, dockerising all processing tasks which include translation (inclusivity, yay!), classification of posts and resource matching. In this way, computation itself is crowd sourced. As and when demand and traffic increases, more systems can participate in running these background tasks, making the system more reliable and eliminating a single point of failure. (Wow, so futuristic! Thank you!)

Also, cell networks may be down at the time of natural disasters, and that is why we have leveraged internet less communication through the Google Nearby Connections API building a mesh network, where devices within a proximity of 100m can communicate with each other. (This was real hard, so kudos to us!)

Have a look at our implementation and give us stars for the stars we are, muahahaha!(just kidding)

