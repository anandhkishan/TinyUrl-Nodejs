pm2 start index.js

cd frontend/app
echo $(pwd)
pm2 start npm -- start
