FROM sktellecom/centos7:node
VOLUME /tmp
ADD . .
EXPOSE 3000
CMD ["npm", "start"]
