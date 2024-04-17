FROM public.ecr.aws/lambda/nodejs:20 

COPY  . .

RUN npm install

RUN npm run build


CMD [ "dist/function.handler" ]