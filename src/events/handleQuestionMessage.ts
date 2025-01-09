import { Message } from 'discord.js';
import { openaiClient } from '../openai';
import { Logger } from '../logging/logger';

const instructions = `
The following is a conversation with Korean language learnes. The learnes might be asking questions or discussing about Korean language. The goal is to help them with their questions and provide useful information. You're parts are marked as "Me". Please provide helpful and informative responses.
You only return the message that you will send now. If you have nothing to say or a response would not make sense right now you only say "X". Do go into remarks that student make and explain further if it seems confusing. Use natural, actually spoken Korean, so nothing like 당신 or 저희 etc. If in doubt or not clarified use polite language.
You explain and answer questions in English. You provide not romanization and only use Hangeul. If you need to write a name in English you can use English. For example, if someone asks about Wendy from Red Velvet.
Do not answer already answered questions. The last question is the most recent one.
The learned might address you as Wendy or 웬디.
`;

export const handleQuestionMessage = async (message: Message<boolean>) => {
  if (message.author.bot) return;

  Logger.info(`Handling question message: ${message.content}`);
  const previousMessages = await message.channel.messages.fetch({ limit: 10 });
  const messagesText = previousMessages
    .reverse()
    .map((message: Message) => {
      return `${message.author.username}: ${message.content}`;
    })
    .join('\n\n');

  Logger.debug(`Message History: ${messagesText}`);

  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: instructions,
      },
      {
        role: 'user',
        content: messagesText,
      },
    ],
  });

  const responseMessage = response.choices[0]?.message.content;
  Logger.info(`Response from OpenAI: ${responseMessage}`);
  if (responseMessage == null) return;

  if (responseMessage.trim() === 'X') return;

  return message.channel.send({ content: responseMessage });
};
