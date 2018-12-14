
import * as clonedeep from 'lodash.clonedeep'
import { model, log, autoLoad } from 'lol2'
import { get_top } from '../services/services'

let res = {
    items: [],
    total_count: 0
}


@log(process.env.NODE_ENV === 'development')
@model({
    namespace: 'data',
    //onBefore:function(effect){console.error(effect)},
    //onAfter:function(effect){console.error(effect)},
    //onError:function(e,effect){console.error(e,effect)}
})
export class Data {
    repositories = res;
    async get_top(query){
        let res=await get_top(query);
        this.repositories=res;
    }
    delete(id){
        this.repositories.items=this.repositories.items.filter(x=>x.id!=id)
    }
}

