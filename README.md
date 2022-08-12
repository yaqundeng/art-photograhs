Our team name is Hala Madrid, and the team members are Wen Huang, Yaqun Deng, and Yichen Han.

This is the backend: https://artportfolio-backend.herokuapp.com/

This is the frontend: https://artportfolio-frontend.herokuapp.com/

There are three collections in MongoDB: photo, my_portfolio, reviews
<img width="1432" alt="image" src="https://media.github.ccs.neu.edu/user/9360/files/bf1d9c99-36e9-44a5-9bcf-dafb41d6daf7">

Collection photo contains all photos. Photo is an object with auther's name and id, AWS_key, AWS_url, date, and an array of user_id who likes this photo.
Photo image is stored in AWS S3 and retrieved by AWS url and AWS key(filename in AWS S3).
User can add and delete photo, and backend will return id of this photo to frontend. 
<img width="1728" alt="image" src="https://media.github.ccs.neu.edu/user/9360/files/02da5acd-c138-41b4-9152-fd3223d924bf">

<img width="1413" alt="image" src="https://media.github.ccs.neu.edu/user/9360/files/786d25f9-e266-4537-8bc4-79e1fbe79f5c">

<img width="1432" alt="image" src="https://media.github.ccs.neu.edu/user/9360/files/3f13c006-e8c1-4b90-93bb-ed4742c8a0b3">

Collection reviews contains all reviews.
User can post, edit and delete reviews.

<img width="1728" alt="image" src="https://media.github.ccs.neu.edu/user/9360/files/2415a2b7-3e3e-4675-8437-4276f45fa28c">

<img width="1728" alt="image" src="https://media.github.ccs.neu.edu/user/9360/files/5d6e6153-624e-4339-b84d-ba6ad19af1ce">

<img width="1160" alt="image" src="https://media.github.ccs.neu.edu/user/9360/files/3ac3d906-6eaa-4149-bde2-309031e773c5">

Collection my_portfolio contains all photos of each user.
When user adds or deletes one photo, backend will return photo_id to frontend, and frontend will update my_portfolio.

<img width="1728" alt="image" src="https://media.github.ccs.neu.edu/user/9360/files/799ddb36-8b34-4814-ba4a-3d7da0038acb">

<img width="1432" alt="image" src="https://media.github.ccs.neu.edu/user/9360/files/227040b9-e2ec-4533-85dc-63c876e944c6">




