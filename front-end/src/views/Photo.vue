<template>
    <div class="photo">
        <img class="full-photo" :src=photo.path alt="photo">
        <div class="photoInfo">
            <p class="photoTitle">{{photo.title}}</p>
            <p class="photoName">{{photo.user.firstName}} {{photo.user.lastName}}</p>
        </div>
        <p class="photoDate">{{formatDate(photo.created)}}</p>
        <p class="photoDescription">{{photo.description}}</p>
        <h3>Add a Comment</h3>
        <form v-on:submit.prevent="addComment">
            <label>
                <textarea v-model="newComment"></textarea>
            </label>
            <br/>
            <button type="submit">Comment</button>
        </form>
        <h3>Comments</h3>
        <div v-for="comment in comments" :key="comment.text">
            <hr>
            <p>{{comment.text}}</p>
            <p><i>-- {{comment.user.firstName}} {{comment.user.lastName}} ({{formatDate(comment.created)}})</i></p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import moment from 'moment'

    export default {
        name: 'Photo',
        data() {
            return {
                show: false,
                photo: {
                    path: "",
                    firstName: "",
                    lastName: "",
                    created: ""
                },
                error: '',
                newComment: '',
                comments: [],
            }
        },
        created() {
            this.getPhoto()
            //this.getComments()
        },
        computed: {
            user() {
                return this.$root.$data.user
            },
        },
        methods: {
            async getPhoto() {
                try {
                    this.response = await axios.get('/api/photos/' + this.$route.params.id)
                    this.photo = this.response.data
                } catch (error) {
                    this.error = error.response.data.message
                }
            },
            formatDate(date) {
                return moment(date).format('d MMMM YYYY')
            },
            async addComment() {
                await axios.post('/api/comments', {
                    photoId: this.$route.params.id,
                    user: this.user,
                    text: this.newComment
                })
                this.getComments()
                this.newComment = ''
            },
            async getComments() {
                try {
                    this.response = await axios.get('/api/comments/' + this.$route.params.id)
                    this.comments = this.response.data.reverse()
                } catch (e) {
                    console.log('error--', e)
                }
            },
        }
    }
</script>

<style>
    .full-photo {
        width: 100%;
        height: 100%;
        padding: 40px;
    }

    .photoInfo {
        display: flex;
        justify-content: space-between;
        font-size: 2em;
        padding-left: 80px;
        padding-right: 80px;
    }

    .photoInfo p {
        margin: 0px;
    }

    .photoDate {
        font-size: 0.7em;
        font-weight: normal;
        padding-left: 80px;
        padding-right: 80px;
    }

    .photoDescription {
        font-size: 0.7em;
        font-weight: normal;
        padding-left: 80px;
        padding-right: 80px;
    }
</style>