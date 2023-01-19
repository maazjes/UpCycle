const baseUrl = 'http://192.168.0.104:8080/api/posts';

const newPost = async ({
  title,
  price,
  imageUri
}: {
  imageUri: string;
  title: string;
  price: string;
}): Promise<Object> => {
  const formdata = new FormData();
  formdata.append('title', title);
  formdata.append('price', price);
  const split = imageUri.split('.');
  const extension = split[split.length - 1];
  formdata.append(
    'img',
    JSON.parse(
      JSON.stringify({
        uri: imageUri,
        name: `image.${extension}`,
        type: `image/${extension}`
      })
    )
  );
  try {
    const res = await fetch(baseUrl, {
      method: 'post',
      headers: {
        authorization:
          'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6MiwiaWF0IjoxNjc0MDcyNzg2fQ.H6RRe6_c9wXHXuuQckN0CYEVVrvOtTBCTQv2z1E7n14',
        'Content-Type': 'multipart/form-data'
      },
      body: formdata
    });
    return res;
  } catch (e) {
    throw new Error('Adding the post failed');
  }
};

export default { newPost };
