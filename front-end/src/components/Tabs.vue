<template>

    <button v-for="tab in ['detail', 'list', 'payment']" :key="tab" @click="activeTab = tab"
        class="py-4 font-semibold border-b-4 transition" :class="activeTab === tab
            ? 'border-green-600 text-green-700'
            : 'border-transparent text-gray-500'">
        {{
            tab === 'detail' ? 'รายละเอียด' :
                tab === 'list' ? 'รายการในแพ็กเกจ' :
                    'วิธีการชำระเงิน'
        }}
    </button>

</template>