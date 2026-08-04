"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import StudentForm from "../../components/StudentForm";
import { getStudent, updateStudent } from "../../data";

export default function EditStudent() {
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Load Student
  useEffect(() => {
    const loadStudent = async () => {
      try {
        const response = await getStudent(id);

        setStudent(response.data);
      } catch (error) {
        console.log(error);
        alert("Failed to load student.");
      } finally {
        setPageLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  // Update Student
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      let imageUrl = formData.image;

      if (formData.image instanceof File) {
        const uploadResponse = await uploadImage(formData.image);

        if (!uploadResponse.success) {
          throw new Error("Image upload failed");
        }

        imageUrl = uploadResponse.data.url;
      }

      await updateStudent(id, {
        ...formData,
        image: imageUrl,
      });

      alert("Student Updated Successfully");
      router.push("/admin/topper-student");
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  if (pageLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Topper Student</h1>

          <p className="text-gray-500">Update student details.</p>
        </div>

        <StudentForm
          initialData={student}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
