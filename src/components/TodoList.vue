<template>
  <div>
    <header>
      <img src="../assets/logo.png"/>
      <div>TodoList</div>
    </header>

    <section class="add-section">
      <input
        type="text"
        class="input-box"
        v-model="todoDescription"
        @keyup.enter="addTodoItem"
        placeholder="添加待办事项"
      />
      <a @click="addTodoItem">✓</a>
    </section>

    <section>
      <!-- 已完成 -->
        <ul>
          <li v-for="(item, index) in todos" :key="item.todoDescription" >
            <div :class="getViewClass(item.done)">
              <input type="checkbox" v-model="item.done" />
              <label @dblclick="getEdit(item)">{{item.todoDescription}}</label>
              <a @click="deleteTodoItem(item)" href="javascript:void(0)">✕</a>
              <input
                class="edit"
                v-todo-focus="item.editing"
                v-if="item.editing"
                :value="item.todoDescription"
                @blur="saveEdit(item, $event)"
                @keydown.enter="saveEdit(item, $event)"
              />
            </div>
          </li>
        </ul>
      <!-- 统计 -->
      <ul>
        <li class="todo-result-li">
          <div class="todo-result">
            <span>未完成：{{todoLength}}/{{this.todoList.length}}</span>
          </div>
        </li>
      </ul>
    </section>

    <footer>
      <span class="switch">
        <input class="switch-box point" type="checkbox" v-model="open"/>显示已完成
      </span>
      <a @click="clearData()" href="javascript:void(0)">清空</a>
    </footer>
  </div>
</template>

<script>
  import * as Utils from '../utils'

  export default {
  name: 'Todolist',

  data () {
    return {
      todoDescription: '', // 待办事项描述
      todoList: [], // 所有待办
      open: true // 是否显示已完成
    }
  },

  computed: {
    // 根据是否显示已完成事项动态调整list显示
    todos() {
      return this.open ? this.todoList : this.todoList.filter(todo => !todo.done);
    },
    // 使用计算属性，就不需要声明属性并维护length的状态
    todoLength() {
      return this.todoList.filter(todo => !todo.done).length;
    }
  },

    watch: {
      // 监听todolist变化，实时更新缓存
      todoList: {
        handler() {
          Utils.setItem("todoList", this.todoList);
        },
        deep: true
      }
    },

  methods: {
    // 如果缓存中有，初始化todoList
    initTodoList () {
      this.todoList = Utils.getItem("todoList", []);
    },
    // 添加todo
    addTodoItem () {
      // 如果内容为空则不添加
      if (this.todoDescription === '') {
        return
      }
      let todoItem = {
        todoDescription: this.todoDescription,
        done: false,
        editing: false
      }
      // 从localstorage中取
      this.todoList = Utils.getItem('todoList', [])
      // 因为循环中使用todoDescription作为唯一key，所以为避免重复，不允许存储相同todoDescription
      for(let item of this.todoList) {
        if (item.todoDescription === this.todoDescription){
          alert("不能输入重复的内容");
          return;
        }
      }
      this.todoList.push(todoItem)
      this.todoDescription = ''
    },
    // 删除todo
    deleteTodoItem (localItem) {
      const index = this.todoList.findIndex(item => item.todoDescription === localItem.todoDescription);
      this.todoList.splice(index, 1)
    },
    // 清空列表
    clearData () {
      Utils.removeItem('todoList')
      this.todoList = []
    },

    // 唤起编辑
    getEdit (localItem) {
      const index = this.todoList.findIndex(item => item.todoDescription === localItem.todoDescription);
      this.todoList[index].editing = true
    },

    // 保存编辑
    saveEdit (localItem, event) {
      const index = this.todoList.findIndex(item => item.todoDescription === localItem.todoDescription);
      this.todoList[index].editing = false
      const editValue = event.target.value
      // 如果编辑之后内容为空，则删除事项
      if (!editValue.length) {
        this.todoList.splice(index, 1)
      } else {
        this.todoList[index].todoDescription = event.target.value
      }
    },

    getViewClass(done) {
      return done ? "view-done" : "view";
    }
  },

  // 双击编辑待办事项时获取焦点
  directives: {
    'todo-focus': {
      inserted: function (el, binding) {
        if (binding.value) {
          el.focus()
        }
      }
    }
  },
  // 钩子函数，页面加载完执行
  mounted () {
    this.initTodoList()
  }
}
</script>


<style scoped>

</style>
