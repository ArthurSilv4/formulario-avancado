'use client'

import { useForm, useFieldArray } from 'react-hook-form'

import { supabase } from '@/lib/supabase'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const creatUserFormSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .transform((list) => list.item(0)!)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'O arquivo precisa ter no maximo 5mb',
    ),
  name: z
    .string()
    .nonempty('O nome é obrigatorio')
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1))
        })
        .join(' ')
    }),
  email: z
    .string()
    .nonempty('O e-mail é obrigatorio')
    .email('formate o email')
    .toLowerCase(),
  password: z.string().min(6, 'A senha precisa de no minimo 6 caracteres'),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty('O titulo é obrigatorio'),
        knowledge: z.coerce
          .number()
          .min(1, 'Precisa ser maior que 0')
          .max(100, 'Precisa ser menor que 101'),
      }),
    )
    .min(2, 'Insira pelo menos 2 tecnologias'),
})

type CreateUserFormData = z.infer<typeof creatUserFormSchema>

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(creatUserFormSchema),
  })

  const { fields, append } = useFieldArray({
    control,
    name: 'techs',
  })

  function addNewTech() {
    append({ title: '', knowledge: 0 })
  }

  async function createrUser(data: CreateUserFormData) {
    await supabase.storage
      .from('Forms Recat')
      .upload(data.avatar.name, data.avatar)

    console.log(data.avatar)

    console.log(data)
  }

  return (
    <main className="flex h-screen bg-zinc-50">
      <form
        onSubmit={handleSubmit(createrUser)}
        className="m-auto flex w-full max-w-xs flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="avatar">Avatar</label>
          <input type="file" accept="image/*" {...register('avatar')} />
          {errors.avatar && (
            <span className="text-sm text-red-500">
              {errors.avatar.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            className="h-10 rounded border border-zinc-200 px-3 shadow-sm"
            type="name"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            className="h-10 rounded border border-zinc-200 px-3 shadow-sm"
            type="email"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            className="h-10 rounded border border-zinc-200 px-3 shadow-sm"
            type="password"
            {...register('password')}
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button
              type="button"
              onClick={addNewTech}
              className="text-xs text-emerald-500"
            >
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex gap-2">
                <div className="flex-1 flex-col gap-1">
                  <input
                    className="h-10 rounded border border-zinc-200 px-3 shadow-sm"
                    type="text"
                    {...register(`techs.${index}.title`)}
                  />

                  {errors.techs?.[index]?.title && (
                    <span className="text-sm text-red-500">
                      {errors.techs?.[index]?.title?.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    className="h-10 w-16 rounded border border-zinc-200 px-3 shadow-sm"
                    type="number"
                    {...register(`techs.${index}.knowledge`)}
                  />

                  {errors.techs?.[index]?.knowledge && (
                    <span className="text-sm text-red-500">
                      {errors.techs?.[index]?.knowledge?.message}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
          {errors.techs && (
            <span className="text-sm text-red-500">{errors.techs.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="h-10 rounded bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
        >
          Salvar
        </button>
      </form>
    </main>
  )
}
