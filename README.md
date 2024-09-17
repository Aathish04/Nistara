# Nistara

Nistara is a decentralised disaster management application with an intuituve social media UI. Users can create "posts" which will be classified as a request for help/items, willingness to donate items or information/updates about the current scenario. 

These "posts" i.e., the requests and the donations will be automatched based on the broad categories of resources being provided/requested for (classified by our classification engine), and the similarity of the item matches and location proximity of the requester and donater. Essentially we have provided a comprehensive solution for crowdsouring disaster relief. 

One really cool thing about Nistara is that we have leveraged the microservices architecture, dockerising all processing tasks which include translation (inclusivity, yay!), classification of posts and resource matching. In this way, computation itself is crowd sourced. As and when demand and traffic increases, more systems can participate in running these background tasks, making the system more reliable and eliminating a single point of failure. (Wow, so futuristic! Thank you!)

Also, cell networks may be down at the time of natural disasters, and that is why we have leveraged internet less communication through the Google Nearby Connections API building a mesh network, where devices within a proximity of 100m can communicate with each other. (This was real hard, so kudos to us!)

Also, we have implemented aadhar-based onboarding (using Setu Digilocker API) 

Here's our implemenation!

User can view all the posts made in recent time and have a look at the posts they made, track their requests and donations in the profile screen. 

https://github.com/user-attachments/assets/de3fd917-2a4c-44bb-945a-986b38d07d08

Happiness through the screen, as we finally got the mesh to work! When the mobile on the left was refreshed, a message was sent to the mobile on the right, both not being connected to the Internet.

https://github.com/user-attachments/assets/8b4267fa-69c9-4ad2-b49a-67f17f2799e4

Early warnings and awareness

<img src="https://github.com/user-attachments/assets/1f1fc531-79bd-49a9-8bdb-0be599768ecf" alt="warnings" width="300" height="auto">

<img src="https://github.com/user-attachments/assets/dc8c7cec-5196-447b-bb31-5ee820284e4f" alt="awareness" width="300" height="auto">











