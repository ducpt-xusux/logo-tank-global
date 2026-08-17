import api from './api';

export const postService = {
    async uploadImage(params: any = {}) {
        const formData = new FormData();
        params.picture && formData.append('picture', params.picture.blob(), params.picture.filename());
        formData.append("_method", "put");

        return api.postData(route('admin.post.upload-image'), formData);
    },
}
