const { MessageEmbed } = require("discord.js");
const { welcomeChannel, reactionRolesChannel } = require("../channels.json");
const { sinEmoji, zonEmoji, barbEmoji, druidEmoji, necroEmoji, pallyEmoji, sorcEmoji, softcoreEmoji, hardcoreEmoji, ladderEmoji, nonLadderEmoji } = require("../constants.json");


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        // Set custom status
        client.user.setActivity('DM "help" for help with commands!');

        // Log that the bot started
        console.log(`Ready! Logged in as ${client.user.tag}`);

        // Fetch the welcome channel by ID
        const welcomeChannelObject = await client.channels.cache.get(welcomeChannel);
        const welcomeChannelMessages = await welcomeChannelObject.messages.fetch({ limit: 1 });

        // Fetch the reaction-roles channel by ID
        const roleChannelObject = await client.channels.cache.get(reactionRolesChannel);
        const roleChannelMessages = await roleChannelObject.messages.fetch({ limit: 1 });
        if (roleChannelMessages?.size) {
            console.log('#roles channel message already set!');
        } else {
            // Create the <Embed>
            const classRoleEmbed = new MessageEmbed()
                .setColor('#4a0400')
                .setTitle('Diablo II: Resurrected Switch Server Class Selection')
                .setAuthor('❤️ The Horadrim')
                .setDescription(`React to this message with one of the following to get that role:
                
:claw_mastery: - **Assassin**
:valkyrie: - **Amazon**
:whirlwind: - **Barbarian**
:summon_grizzly: - **Druid**
:raise_skeleton: - **Necromancer**
:blessed_hammer: - **Paladin**
:blizzard: - **Sorceress**`);

            const charRoleEmbed = new MessageEmbed()
                .setColor('#4a0400')
                .setTitle('Diablo II: Resurrected Switch Server Character Role Selection')
                .setAuthor('❤️ The Horadrim')
                .setDescription(`React to this message with one of the following to get that role:

-Softcore
-Hardcore
-Ladder
-Non-Ladder

You may select any number of these to let others know what kind of player you are. In a future update, these roles will act as options to what channels you see in your channel list. For now, they're just flavoring.`);

            const classEmbed = await roleChannelObject.send({ embeds: [classRoleEmbed] });
            const charEmbed = await roleChannelObject.send({ embeds: [charRoleEmbed] });

            // FIXME: There's a lot of API calls with these. If I can ever fix this...let's do that
            // Class Role Reactions
            try {
                await classEmbed.react(sinEmoji);
                await classEmbed.react(zonEmoji);
                await classEmbed.react(barbEmoji);
                await classEmbed.react(druidEmoji);
                await classEmbed.react(necroEmoji);
                await classEmbed.react(pallyEmoji);
                await classEmbed.react(sorcEmoji);

                // Char Role Reactions
                await charEmbed.react(softcoreEmoji);
                await charEmbed.react(hardcoreEmoji);
                await charEmbed.react(ladderEmoji);
                await charEmbed.react(nonLadderEmoji);
            } catch (err) {
                console.error('One of the emoji failed to react:', err);
            }


        }

        if (welcomeChannelMessages?.size) {
            console.log('#welcome channel message already set!');
        } else {
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

**8.** Advertisement is prohibited. At a minimum, please ask an admin to have something promoted, and it may be considered.

**9.** Anything that violates the Discord ToS (https://discordapp.com/terms) is also prohibited. Additionally, emulation talk is prohibited.

**10.** Do not play the game of "how far can I push the rules", you will be punished at staff member discretion.

**11.** If a user is otherwise misbehaving for a reason not explicitly stated in rules but is proving to be a negative effect on the server, 
staff members reserve the right to enact punishment accordingly.

**12.** You are expected to be aware of these rules upon joining the server and/or adding a role to yourself. Ignorance is not an excuse. Also, not adding a role to yourself does not give you a pass.

**13.** Please set your Nickname on the server to your Switch Profile Name. You can do this with the slash-command, /nick <nickname>. This makes it easier for those playing with you to find you in Switch Online.

**14.** Please do not engage in Real Money Trading on this server. Punishment will follow server policy. Discussion regarding prices in terms of FG is OK but please do not buy, sell or trade FG or items for real money in the server.

**15.** Loot rules are presumed to be Free-For-All unless otherwise specified by the host or otherwise agreed upon by the entire party. Moderators will not get involved in loot disputes (unless other rules are being broken) as these should be handled by those in the party.

If you have any questions, please reach out to a <@&891492181423046727> member.

__**Server punishment policy**__
**1.** If a moderator feels you have broken a rule they will give a simple verbal warning to change your behavior. This is not a strike, but can escalate to one if the behavior continues.

**2.** If you continue to break the rules after being muted or kicked once you will be banned on the next infraction. You may appeal your ban by contacting a staff member after three months have passed since the ban.

**3.** We will enforce a zero-tolerance policy on newcomers. If you recently joined and begin to push or violate rules, you will be treated differently than a long-term user. Be on your best behaviour, and set a good example. For example, if you join, and immediately ignore a verbal warning to stop, there is a high chance of being banned on the spot.

If the initial violation is severe enough, such as posting blatant NSFW or attempting to raid the server you will be muted or banned on the spot regardless of previous violations.`);


            const channelsEmbed = new MessageEmbed()
                .setColor('#4a0400')
                .setDescription(`__**Channel Explanations**__
**SERVER INFORMATION**
<#892563722810310686> - This channel
<#897470401091870801> - The announcements channel. Admins will post information regarding Blizzard updates and this Discord server updates
<#918523016827269152> - The roles channel. Go here to add class and character roles to see or remove yourself from certain channels

**COMMUNITY**
<#923742062355042364> - All general D2R Discussion goes here
<#895858420928892958> - Show off that sweet loot! Keep discussion to the postings only please
<#890339324107845632> - Add your friend code, profile name, and Timezone here
<#890379488226066483> - Different links and guides for D2R. Class-specific builds do not go here. Please put those in the class specific channels (described below)
<#900382224313118781> - Ask the community what an item is worth
<#896813603963945034> - All other off-topic chats go here
<#923795185241034762> - Other unrelated D2R Giveaways from the mods will go here

**PVP-CENTRAL**
<#916850855385366598> - The rules of the PvP Tournament that is going on or coming up
<#917407833165811742> - The results of the PvP Tournament that just completed
<#917407016052482108> - The tournament lobby channel
<#917407301948805172> - Tournament Chat #1
<#917407444563550239> - Tournament Chat #2

**CHARACTER TYPE CHANNELS (SOFTCORE/HARDCORE; LADDER & NON-LADDER)**
There are two categories for Softcore and Hardcore, Ladder and Non-Ladder. Each channel is prefixed with either "sc" or "hc" to denote Softcore or Hardcore followed by "la" for ladder or "nl" for non-ladder. They have the same types of channels.

**general** - Discuss anything related to D2R
**trading** - Trade listings go here. Mark your trades with "WTS" or "WTB" for your listing to be sent
**price-checks** - Check for prices for your game type
**looking-for-group** - Create LFG posts using the bot command **/lfg**. Follow the prompts and create an lfg listing
**rush-me-plz** - Ask for rushes here
**pvp** - Any tournament announcements or PvP announcements go here
**giveaways** - Giveaways for different items will be posted here

**CLASSES**
These are the channels dedicated to the 7 classes of the game. Discuss anything class related here. Guides and videos are fine here. Please still use <#891014799117393922> or <#895814291595350016> for all trading needs.

**GAME CHATS**
If you are playing with others and not using voice, use these channels to communicate since Switch does not have in-game chat.`);

            await welcomeChannelObject.send({ embeds: [rulesEmbed] });
            await welcomeChannelObject.send({ embeds: [channelsEmbed] });
        }
    }
}

