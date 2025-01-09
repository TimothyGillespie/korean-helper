import { SlashCommandBuilder } from 'discord.js';
import { DiscordCommand } from '../types/discord';
import { searchKoreanWord } from '../krdict/searchKoreanWord';

export const meaningOf: DiscordCommand = {
  data: new SlashCommandBuilder()
    .setName('meaning-of')
    .setDescription('Get the meaning of a Korean word.')
    .addStringOption((option) =>
      option.setName('korean').setDescription('The Korean word you want to know the meaning of.').setRequired(true),
    ),
  execute: async (interaction) => {
    const koreanWord = interaction.options.getString('korean', true);

    try {
      const meaning = await searchKoreanWord(koreanWord);
      // Cut to max 3 translations

      const translations = meaning.map((meaning) => {
        const translations = meaning.translations.slice(0, 3).map((translation) => {
          return `**${translation.translationWord}**: ${translation.translationDefinition}`;
        });

        return `**${meaning.word}**\n${translations.join('\n')}`;
      });

      const embed = {
        title: `Meaning of ${koreanWord}`,
        description: translations.join('\n\n'),
      };

      return interaction.reply({
        ephemeral: false,
        allowedMentions: {},
        embeds: [embed],
      });
    } catch (error) {
      console.error('Error fetching data from API:', error);
      return interaction.reply({
        ephemeral: true,
        content: 'Could not find the translation for the given word.',
      });
    }
  },
};
