module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        console.log(`Member ${member.user.username} joined! Adding role...`)
        member.roles.add('899678109136203807');
        console.log('Role successfully added!')
    }
}