<template>
    <app-media-grid :media="media" />
</template>

<script>
    export default {
        props:{
            room:{
                type: Object,default:()=>{}
            }
        },
        computed:{
            media(){
                let rs = [];

                let {diagrams,models} = this.room;

                if(diagrams){
                    rs = rs.concat(diagrams.map(i=>{
                        return {
                            ...i,
                            label:'户型图'
                        }
                    }));
                }
                if(models){
                    rs = rs.concat(models.map(i=>{
                        return {
                            ...i,
                            label:'样板间'
                        }
                    }));
                }

                return rs;
            },
        }
    }
</script>