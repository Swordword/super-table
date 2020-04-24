<template>
  <div class="super-table-comp">
    <div v-if="checkedNum>0" class="action-list-border">
      <el-checkbox v-model="allChecked" class="action-check" />
      <div class="action-list">
        <span>已选择{{ checkedNum }}项</span>
        <!-- 默认actionTabs -->
        <span
          v-if="checkedNum==1&&actionShow"
          @click="editTable"
        >
          <i class="iconfont icon-bianji" />
          修改
        </span>
        <span
          v-if="checkedNum==1&&actionShow"
          @click="viewTable"
        >
          <i class="iconfont icon-chakan" />
          查看
        </span>
        <span v-if="actionShow" @click="deleteTable">
          <i class="iconfont icon-shanchu" />
          删除
        </span>
        <slot name="moreTabs" :data="tableAllCheckedList" />
      </div>
    </div>
    <el-table
      :data="tableDataCopy"
      style="width: 100%"
      :stripe="stripe"
      :show-header="checkedNum===0"
      :class="{
        'super-tab-hasSelected':checkedNum>0
      }"
      @cell-mouse-enter="rowHover"
      @cell-mouse-leave="hoverIndex=null"
    >
      <el-table-column v-if="editable" width="48">
        <template v-slot:header>
          <el-checkbox v-model="allChecked" />
        </template>
        <template slot-scope="scope">
          <el-checkbox
            v-if="hoverIndex==scope.row.id||scope.row.checked"
            v-model="scope.row.checked"
          />
          <span v-else>{{ ++scope.$index }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(header, index) in headerListCopy"
        :key="index"
        :min-width="header.width||''"
        :width="header.realWidth||''"
        :fixed="header.fixed"
      >
        <template slot="header">
          <span>{{ header.label }}</span>
        </template>
        <template slot-scope="scope">
          <div v-if="header.type=='image'">
            <ImageView
              :url="scope.row[header.prop]||''"
              :def="defImg"
              :width="header.imgWidth"
              :height="header.imgHeight"
              :compress="true"
              :preview="header.preview||false"
            />
          </div>
          <div v-else-if="header.type=='size'">
            <span>{{ bytesToSize(scope.row[header.prop]||scope.row.size) }}</span>
          </div>
          <div v-else-if="header.type=='textarea'" :min-width="header.width||''">
            <el-tooltip v-if="scope.row[header.prop]" placement="left" popper-class="textarea-card">
              <div
                slot="content"
                class="textarea-content"
                v-html="replaceAll(scope.row[header.prop])"
              />
              <div :min-width="header.width||''" class="textarea-label">{{ scope.row[header.prop] }}</div>
            </el-tooltip>
            <span v-else>无</span>
          </div>
          <div v-else-if="header.type=='time'">
            <span>{{ scope.row[header.prop]?parseTime(scope.row[header.prop],header.format):'无' }}</span>
          </div>
          <div v-else-if="header.type=='propObj'">
            <span>{{ scope.row[header.prop]?scope.row[header.prop][header.value]?scope.row[header.prop][header.value]:scope.row[header.prop].name:'无' }}</span>
          </div>
          <div v-else-if="header.type=='gender'">
            <span>{{ scope.row[header.prop]=='MAN'?'男':'女' }}</span>
          </div>
          <!-- ！！插槽封装 ！！-->
          <div v-else-if="header.type=='slotItem'">
            <slot :name="header.name" :data="scope.row" />
          </div>
          <div v-else>
            <span>{{ scope.row[header.prop]||defaultValue }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- *分页* -->
    <div class="pagination-container">
      <el-pagination
        v-show="pager.recordCount>0"
        :current-page.sync="pager.pageNumber"
        :page-sizes="[10, 15, 20, 30, 50, 99]"
        :page-size="pager.pageSize"
        :total="pager.recordCount"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { bytesToSize,parseTime, deepClone,replaceAll } from './utils'
import ImageView from './ImageView.vue'

export default {
  name: 'SuperTable',
  components: {
    ImageView
  },
  props: {
    // 表格数据
    tableData: {
      type: Array,
      required: true
      // required: false,
      // default: () => []
    },
    // 表头列表
    headerList: {
      type: Array,
      required: true
      // required: false, 
      // default: () => []
    },
    // 是否开启编辑功能
    editable: {
      type: Boolean,
      default: false
    },
    // 是否显示编辑删除等默认操作
    actionShow: {
      type: Boolean,
      default: true
    },
    stripe:{
      type:Boolean,
      default:true
    },
    // ImageView默认图
    defImg: {
      type: String,
      default: ''
    },
    // 无数据时显示
    defaultValue: {
      type: String,
      default: '无'
    },
    pager: {
      type: Object,
      default: () => {
        return {
          pager: {
            pageCount: 1,
            pageNumber: 1,
            pageSize: 10,
            recordCount: 0
          }
        }
      }
    },
    tableAllCheckedList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hoverIndex: null,
      tableDataCopy: []
    }
  },
  computed: {
    loginUser() {
      return this.$store.state.user.uinfo
    },
    checkedNum() {
      return this.tableAllCheckedList.length
    },
    allChecked: {
      get: function() {
        if (!this.tableDataCopy.length) {
          return false
        }
        return this.tableDataCopy.every(table => {
          return table.checked
        })
      },
      set: function(val) {
        this.tableDataCopy.forEach(data => {
          data.checked = val
        })
      }
    },
    headerListCopy() {
      return this.headerList.filter(header => {
        return header
      })
    },
    selectedCol() {
      return this.tableDataCopy.filter(table => {
        return table.checked
      })
    }
  },
  watch: {
    tableDataCopy: {
      immediate: true,
      deep: true,
      handler(val) {
        this.handleAllCheckedList(val)
        this.$emit('update:tableAllCheckedList', this.tableAllCheckedList)
      }
    }
  },
  created() {
    // 判断当前数组是否含有选中状态
    const newTableData = deepClone(this.tableData)
    const keylist = this.tableAllCheckedList.map(item => {
      return item.id
    })
    newTableData.forEach(table => {
      if (keylist.includes(table.id)) {
        table['checked'] = true
      } else {
        table['checked'] = false
      }
    })
    this.tableDataCopy = newTableData
  },
  methods: {
    // 修改表格列
    editTable() {
      this.$emit('editTable', this.selectedCol)
    },
    viewTable() {
      this.$emit('viewTable', this.selectedCol)
    },
    // 删除表格列
    deleteTable() {
      const selectedTable = []
      this.tableDataCopy.forEach(table => {
        if (table.checked) {
          selectedTable.push(table.id)
        }
      })
      this.$emit('deleteTable', selectedTable)
    },
    // 当前hover所在列
    rowHover(row) {
      this.hoverIndex = row.id
    },
    // 获取所有选中列表
    /* eslint-disable no-unused-vars */
    handleAllCheckedList(array) {
      var keyList = this.tableAllCheckedList.map(item => {
        return item.id
      })
      array.forEach((item, index) => {
        if (!keyList.includes(item.id)) {
          if (item.checked) {
            this.tableAllCheckedList.push(item)
          }
        } else {
          var index1 = this.tableAllCheckedList.findIndex(parentItem => {
            return parentItem.id === item.id
          })
          this.tableAllCheckedList.splice(index1, 1)
          index --
          if (item.checked) {
            this.tableAllCheckedList.push(item)
          }
        }
      })
    },
    // tool
    // 时间转换
    parseTime(time, format = '{y}-{m}-{d}') {
      return parseTime(time, format)
    },
    bytesToSize(bytes) {
      return bytesToSize(bytes)
    },
    // 简单dom替换
    replaceAll(str) {
      if (!str) {
        return '无'
      }
      const res = '<p>' + replaceAll(str, /\n/g, '</p><p>') + '</p>'
      return res
    },
    handleCurrentChange() {
      this.handleAllCheckedList(this.tableDataCopy)
      this.$emit('update:tableAllCheckedList', this.tableAllCheckedList)
      this.$emit('update:pager', this.pager)
    },
    handleSizeChange(val) {
      this.handleAllCheckedList(this.tableDataCopy)
      this.pager.pageSize = val
      this.$emit('update:tableAllCheckedList', this.tableAllCheckedList)
      this.$emit('update:pager', this.pager)
    }
  }
}
</script>

<style lang="css" scope>
.action-check {
  float: left;
  top: 14px;
  left: 20px;
}
.action-list-border{
  display: flex;
  flex-direction: row;
  justify-content:flex-start;
  align-items: center;
  padding-left: 10px;
}
.action-list {
  padding-left: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  height: 45px;
  line-height: 45px;
  padding-left: 40px !important;
  background-color: #fafafa;
  border-bottom: 1px solid #dfe6ec;
}
.super-tab-hasSelected {
  /* .el-table__fixed-body-wrapper {
    top: 0 !important;
  } */
}
.el-table__body td .cell {
  white-space: pre-wrap;
}

.textarea-card {
  width: 180px;
}
.textarea-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
