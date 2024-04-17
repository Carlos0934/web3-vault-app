FROM public.ecr.aws/lambda/nodejs:20 

COPY  . .

RUN dnf install  cmake clang  openssl  -y
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y



RUN npm install

RUN npm run build


CMD [ "dist/function.handler" ]