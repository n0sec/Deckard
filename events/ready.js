const { MessageEmbed } = require("discord.js");
const { guildId, welcomeChannel } = require("../channels.json");


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        // Set custom status
        client.user.setActivity('Stay a while and listen!');

        // Log that the bot started
        console.log(`Ready! Logged in as ${client.user.tag}`);

        // Fetch the welcome channel by ID
        const welcomeChannelObject = await client.channels.cache.get(welcomeChannel);
        const welcomeChannelMessages = await welcomeChannelObject.messages.fetch({ limit: 1 });
        if (welcomeChannelMessages?.size) {
            console.log('#welcome channel message already set!');
        } else {
            // Get the emoji IDs from Discord
            // \:emoji_name:
            const sinEmoji = '892211955236999219';
            const zonEmoji = '892208767893110856';
            const barbEmoji = '892211955459313724';
            const druidEmoji = '892211955140546641';
            const necroEmoji = '892211955442515998';
            const pallyEmoji = '892211954993733653';
            const sorcEmoji = '892211955597713468';

            // Create the <Embed>
            const flairingEmbed = new MessageEmbed()
                .setColor('#4a0400')
                .setTitle('Diablo II: Resurrected Switch Server Flairing')
                .setAuthor('❤️ The Horadrim')
                .setDescription(`Please read the above rules first before proceeding. Ignorance is not an excuse. By participating in the server, you agree that you have read the rules and agree to them without exception.

Please select a role to identify the class you play the most. Selecting a role will allow others to ping the role for questions and distinguish you from everyone else! You can select as many as you want but keep in mind this may result in more notifications.

<:claw_mastery:892211955236999219> - **Assassin**
<:valkyrie:892208767893110856> - **Amazon**
<:whirlwind:892211955459313724> - **Barbarian**
<:summon_grizzly:892211955140546641> - **Druid**
<:raise_skeleton:892211955442515998> - **Necromancer**
<:blessed_hammer:892211954993733653> - **Paladin**
<:blizzard:892211955597713468> - **Sorceress**

If a reaction doesn't work, feel free to DM a <@&891492181423046727> member!`);

            const rulesEmbed = new MessageEmbed()
                .setColor('#4a0400')
                .setTitle('Diablo II: Resurrected Switch Server Rules')
                .setAuthor('❤️ The Horadrim')
                .setDescription(`__**Server Rules**__
**1.** NSFW content of a sexually explicit nature is strictly prohibited. Do not post any imagery or context that is inappropriate. 
This also extends to using a NSFW avatar/name. You will be asked to stop. If you come in the server and violate this rule, you will be banned promptly. 
To elaborate, imagery of a sexual nature is prohibited. Cursing is allowed but please be sparse in your f-bombs.

**2.** Racism, homophobia, sexism, transphobia, ableism and other forms of discrimination are all things that will not be tolerated in any shape or form. 
This extends to cultures and personal beliefs. Please be considerate of the varying backgrounds of the community.

**3.** Do not spam. Spamming is the repetition of any comment over any period of time. What constitutes as spam will be handled at staff member discretion.

**4.** Do not incriminate yourself by posting your personal information online, such as your address or credit card number.

**5.** We will not tolerate toxicity on this server. Do not be obnoxious to other members. Do not come in to troll. Please be respectful of all users.

**6.** Do not impersonate another staff member or personality. This offense can and will be punished severely depending on the severity of the case.

**7.** Please remain on topic to that channel. You can see the purpose of the channel via the channel description, or in this channel (rules).

**8.** Advertisement is prohibited. At the minimum, please ask a staff member to have something promoted, and it may be considered.

**9.** Anything that violates the Discord ToS (https://discordapp.com/terms) is also prohibited. Additionally, emulation talk is prohibited.

**10.** Do not play the game of "how far can I push the rules", you will be punished at staff member discretion.

**11.** If a user is otherwise misbehaving for a reason not explicitly stated in rules but is proving to be a negative effect on the server, 
staff members reserve the right to enact punishment accordingly.

**12.** You are expected to be aware of these rules upon flairing yourself. Ignorance is not an excuse. Also, not flairing yourself does not give you a pass.

**13.** Please set your Nickname on the server to your Switch Profile Name. You can do this with the slash-command, /nick <nickname>. This makes it easier for those playing with you to find you in Switch Online.

**14.** Please do not engage in Real Money Trading on this server. Punishment will follow server policy. Discussion regarding prices in terms of FG is OK but please do not buy, sell or trade FG or items for real money in the server.

If you have any questions, please reach out to a <@&891492181423046727> member.

__**Server punishment policy**__
**1.** If a moderator feels you have broken a rule they will give a simple verbal warning to change your behavior. This is not a strike, but can escalate to one if the behavior continues.

**2.** If you continue to break a rule or the violation is severe enough then you will be given a bot warning, this will be permanent and is considered a strike against you. 

**3.** If you continue to break the rules after being muted or kicked once you will be banned on the next infraction. You may appeal your ban by contacting a staff member after three months have passed since the ban.

**5.** We will enforce a zero-tolerance policy on newcomers. If you recently joined and begin to push or violate rules, you will be treated differently than a long-term user. Be on your best behaviour, and set a good example. For example, if you join, and immediately ignore a verbal warning to stop, there is a high chance of being banned on the spot.

If the initial violation is severe enough, such as posting blatant NSFW or attempting to raid the server you will be muted or banned on the spot regardless of previous violations.`);


            const channelsEmbed = new MessageEmbed()
                .setColor('#4a0400')
                .setDescription(`__**Channel Explanations**__
**SERVER INFORMATION**
<#892563722810310686> - This channel
<#897470401091870801> - The announcements channel. Admins will post information regarding Blizzard updates and this Discord server updates.

**GENERAL**
<#890339324107845632> - Add your friend code and Timezone here!
<#890379488226066483> - Different links and guides for D2R. Class-specific builds do not go here. Please put those in the class specific channels (described below)
<#895858420928892958> - Show off that sweet loot! Keep discussion to the postings only please!
<#896813603963945034> - All other off-topic chats go here

**CHARACTER TYPE CHANNELS (SOFTCORE/HARDCORE)**
There are two categories for Softcore and Hardcore. Both ladder and non-ladder discussions can take place in here. We could not break up the different combinations of characters that people could have so we left it at softcore and hardcore. Each channel is prefixed with either "sc" or "hc" to denote Softcore or Hardcore. They have the same types of channels.

**general** - Discuss anything related to D2R
**trading** - Create trade posts using the bot command **/trade**. Follow the prompts and create a trade posting.
**looking-for-group** - Create LFG posts using the bot command **/lfg**. Follow the prompts and create an lfg posting. Posting in this channel, you must have DMs enabled.
**rush-me-plz** - Ask for rushes using the bot command **/rush**. Follow the prompts and create a rush posting. Posting in this channel, you must have DMs enabled.

**CLASSES**
These are the channels dedicated to the 7 classes of the game. Discuss anything class related here. Guides and videos are fine here. Please still use <#891014799117393922> or <#895814291595350016> for all trading needs.

**GAME CHATS**
If you are playing with others and not using voice, use these channels to communicate since Switch does not have in-game chat.`);

            await welcomeChannelObject.send({ embeds: [rulesEmbed] });
            await welcomeChannelObject.send({ embeds: [channelsEmbed] });

            const messageEmbed = await welcomeChannelObject.send({ embeds: [flairingEmbed] });

            // Add the reactions to the embed
            messageEmbed.react(sinEmoji);
            messageEmbed.react(zonEmoji);
            messageEmbed.react(barbEmoji);
            messageEmbed.react(druidEmoji);
            messageEmbed.react(necroEmoji);
            messageEmbed.react(pallyEmoji);
            messageEmbed.react(sorcEmoji);
        }
    }
}

