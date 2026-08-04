"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import StudentForm from "../components/StudentForm";
import { createStudent } from "../data";

export default function AddStudent() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      let imageUrl = formData.image;

      // Agar image File hai to pehle upload karo
      if (formData.image instanceof File) {
        const uploadResponse = await uploadImage(formData.image);

        if (!uploadResponse.success) {
          throw new Error("Image upload failed");
        }

        imageUrl = uploadResponse.data.url;
      }

      await createStudent({
        ...formData,
        image: imageUrl,
      });

      alert("Student Added Successfully");
      router.push("/admin/topper-student");
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Add Topper Student</h1>

            <p className="text-gray-500">Create a new topper student.</p>
          </div>
        </div>

        <StudentForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
